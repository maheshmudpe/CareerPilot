import type { Request, Response } from "express";
import fs from "node:fs/promises";

import { uploadFileSchema } from "./file.schema.js";
import {
    createFileService,
    validateUploadedFile,
    getFilesService
} from "./file.service.js";

export const uploadFileController = async (
    req: Request,
    res: Response
) => {

    const userId = req.user!.id;

    if (!req.file) {
        return res.status(400).json({
            message: "File is required",
        });
    }

    const result = uploadFileSchema.safeParse(req.body);

    if (!result.success) {
        await fs.unlink(req.file.path);

        return res.status(400).json({
            message: "Invalid file metadata",
            errors: result.error.issues,
        });
    }

    const fileValidation = validateUploadedFile(req.file);

    if (!fileValidation.valid) {
        await fs.unlink(req.file.path);

        return res.status(400).json({
            message: fileValidation.message,
        });
    }

    const createdFile = await createFileService(
        userId,
        req.file,
        result.data
    );

    return res.status(201).json({
        message: "File uploaded successfully",
        file: createdFile,
    });
};


export const getFilesController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const files = await getFilesService(userId);

    return res.status(200).json({
        files,
    });
};