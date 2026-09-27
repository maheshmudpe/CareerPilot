import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32),

    JWT_EXPIRES_IN: z.string().min(1),

    PORT: z.coerce.number().int().positive(),

    FRONTEND_URL: z.string().url(),

    SUPABASE_URL: z.string().url(),

    SUPABASE_SECRET_KEY: z.string().min(1),

    SUPABASE_BUCKET: z.string().min(1),

    
});

export const env = envSchema.parse(process.env);