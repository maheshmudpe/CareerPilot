import type { NextFunction, Request, Response } from "express";

import { AppError } from "./AppError.js";
import { ZodError } from "zod";
import multer from "multer";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size must not exceed 5 MB",
            });
        }

        return res.status(400).json({
            message: "File upload failed",
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Unexpected server error
    console.error("UNEXPECTED SERVER ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "internal server error",
    });
};