import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    PORT: z.coerce.number(),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    SUPABASE_BUCKET: z.string().min(1),
});


export const env = envSchema.parse(process.env);

