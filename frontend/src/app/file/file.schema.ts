import { z } from "zod";

export const uploadedFileSchema = z.object({
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
  files: z.array(uploadedFileSchema),
});

export const uploadFileResponseSchema = z.object({
  message: z.string(),
  file: uploadedFileSchema,
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;