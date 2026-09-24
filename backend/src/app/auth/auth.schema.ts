import { z } from 'zod';


export const registerSchema = z.object({

    email:z.email(),
    password:z.string().min(8, "Password must be at least 8 characters")
})


export const loginSchema = z.object({


    email:z.email(),
    password: z.string().min(8),

})


export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;