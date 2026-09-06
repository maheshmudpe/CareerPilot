import { z } from 'zod';


export const registerSchema = z.object({

    email:z.email(),
    password:z.string().min(12)
})


export type RegisterPayload = z.infer<typeof registerSchema>;