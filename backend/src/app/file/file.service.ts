import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import {
    applicationsTable,
    filesTable,
} from "../../db/schema.js";

import { env } from "../../config/env.js";
import { supabase } from "../../common/storage/supabase.js";
import { NotFoundError } from "../../common/errors/HttpErrors.js";

import type { UploadFilePayload } from "./file.schema.js";


const allowedMimeTypes = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExtensions = new Set([
    ".pdf",
    ".docx",
]);


const deleteUploadedFile = async (filePath: string) => {
    try {
        await fs.unlink(filePath);
    } catch {
        // File may already be deleted or unavailable.
    }
};


const deleteSupabaseFile = async (storageKey: string) => {
    try {
        await supabase.storage
            .from(env.SUPABASE_BUCKET)
            .remove([storageKey]);
    } catch {
        // Best-effort cleanup.
    }
};


export const validateUploadedFile = (
    file: Express.Multer.File
) => {

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedMimeTypes.has(file.mimetype)) {
        return {
            valid: false,
            message: "Only PDF and DOCX files are allowed",
        };
    }

    if (!allowedExtensions.has(extension)) {
        return {
            valid: false,
            message: "Invalid file extension",
        };
    }

    return {
        valid: true,
    };
};


export const createFileService = async (
    userId: string,
    file: Express.Multer.File,
    payload: UploadFilePayload
) => {

    /*
     * 1. Verify application ownership
     */

    if (payload.applicationId) {

        const [application] = await db
            .select({
                id: applicationsTable.id,
            })
            .from(applicationsTable)
            .where(
                and(
                    eq(
                        applicationsTable.id,
                        payload.applicationId
                    ),
                    eq(
                        applicationsTable.userId,
                        userId
                    )
                )
            );

        if (!application) {
            await deleteUploadedFile(file.path);

            throw new NotFoundError(
                "Application not found"
            );
        }
    }


    /*
     * 2. Generate unique Supabase storage path
     */

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const uniqueName = `${crypto.randomUUID()}${extension}`;

    const folder = payload.applicationId
        ? `${userId}/${payload.applicationId}`
        : `${userId}/general`;

    const storageKey = `${folder}/${uniqueName}`;

    let cloudUploadCompleted = false;


    try {

        /*
         * 3. Read temporary local file
         */

        const fileBuffer = await fs.readFile(
            file.path
        );


        /*
         * 4. Upload file to Supabase Storage
         */

        const { error: uploadError } =
            await supabase.storage
                .from(env.SUPABASE_BUCKET)
                .upload(
                    storageKey,
                    fileBuffer,
                    {
                        contentType: file.mimetype,
                        upsert: false,
                    }
                );

        if (uploadError) {
            throw new Error(
                "Failed to upload file"
            );
        }

        cloudUploadCompleted = true;


        /*
         * 5. Store metadata in PostgreSQL
         */

        const [createdFile] = await db
            .insert(filesTable)
            .values({
                userId,
                applicationId: payload.applicationId,
                fileName: file.originalname,
                storageKey,
                mimeType: file.mimetype,
                fileSize: file.size,
                fileType: payload.fileType,
            })
            .returning();


        /*
         * 6. Remove temporary local file
         */

        await deleteUploadedFile(file.path);


        return createdFile;

    } catch (error) {

        /*
         * 7. Cleanup local temporary file
         */

        await deleteUploadedFile(file.path);


        /*
         * 8. Cleanup Supabase object
         * if it was successfully uploaded
         */

        if (cloudUploadCompleted) {
            await deleteSupabaseFile(storageKey);
        }


        throw error;
    }
};


export const getFilesService = async (userId: string) => {
    const files = await db
        .select()
        .from(filesTable)
        .where(eq(filesTable.userId, userId));

    return files;
};



export const deleteFileService = async (
    userId: string,
    fileId: string
) => {

    const [file] = await db
        .select()
        .from(filesTable)
        .where(
            and(
                eq(filesTable.id, fileId),
                eq(filesTable.userId, userId)
            )
        );

    if (!file) {
        throw new NotFoundError(
            "File not found"
        );
    }

    /*
     * 1. Delete file from Supabase Storage
     */

    await supabase.storage
        .from(env.SUPABASE_BUCKET)
        .remove([file.storageKey]);

    /*
     * 2. Delete file metadata from PostgreSQL
     */

    await db
        .delete(filesTable)
        .where(
            and(
                eq(filesTable.id, fileId),
                eq(filesTable.userId, userId)
            )
        );

    return file;
};

export const getFileUrlService = async (
    userId: string,
    fileId: string
) => {
    const [file] = await db
        .select()
        .from(filesTable)
        .where(
            and(
                eq(filesTable.id, fileId),
                eq(filesTable.userId, userId)
            )
        );

    if (!file) {
        throw new NotFoundError(
            "File not found"
        );
    }

    const { data, error } =
        await supabase.storage
            .from(env.SUPABASE_BUCKET)
            .createSignedUrl(
                file.storageKey,
                60 * 5
            );

    if (error || !data?.signedUrl) {
        throw new Error(
            "Unable to generate file URL"
        );
    }

    return data.signedUrl;
};