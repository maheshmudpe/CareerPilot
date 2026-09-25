import { z } from "zod";

export const uploadFileSchema = z.object({
    fileType: z.enum([
        "RESUME",
        "COVER_LETTER",
    ]),

    applicationId: z.uuid().optional(),
});

export const fileSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    applicationId: z.uuid().nullable(),
    fileName: z.string(),
    storageKey: z.string(),
    mimeType: z.string(),
    fileSize: z.number(),
    fileType: z.enum([
        "RESUME",
        "COVER_LETTER",
        "PORTFOLIO",
        "TRANSCRIPT",
        "CERTIFICATE",
        "OTHER",
    ]),
    createdAt: z.coerce.date(),
});

export const filesResponseSchema = z.object({
    files: z.array(fileSchema),
});

export type UploadFilePayload = z.infer<
    typeof uploadFileSchema
>;

export type FileResponse = z.infer<typeof fileSchema>;
