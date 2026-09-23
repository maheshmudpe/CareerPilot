import { z } from "zod";

export const uploadFileSchema = z.object({
    fileType: z.enum([
        "RESUME",
        "COVER_LETTER",
    ]),

    applicationId: z.uuid().optional(),
});

export type UploadFilePayload = z.infer<
    typeof uploadFileSchema
>;