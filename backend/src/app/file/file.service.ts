import path from "node:path";
import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import {
    applicationsTable,
    filesTable,
} from "../../db/schema.js";

import { NotFoundError } from "../../common/errors/HttpErrors.js";
import fs from "node:fs/promises";
import type {
    UploadFilePayload,
} from "./file.schema.js";

const allowedMimeTypes = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExtensions = new Set([
    ".pdf",
    ".docx",
]);

const deleteUploadedFile = async (
    filePath: string
) => {
    try {
        await fs.unlink(filePath);
    } catch {
        // File may already be deleted or unavailable.
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


    try {
           const [createdFile] = await db
        .insert(filesTable)
        .values({
            userId,
            applicationId: payload.applicationId,
            fileName: file.originalname,
            storageKey: file.filename,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileType: payload.fileType,
        })
        .returning();

    return createdFile;
        
    } catch (error) {

         await deleteUploadedFile(file.path);

         throw error;
        
    }
 
};