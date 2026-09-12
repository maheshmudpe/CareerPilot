import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    linkedinUrl: z.url().optional(),
    githubUrl: z.url().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);


export const addSkillSchema = z.object({
    name: z.string().trim().min(1),
});


export const skillIdSchema = z.object({
    skillId: z.uuid(),
});



export type SkillIdParams = z.infer<typeof skillIdSchema>;
export type AddSkillPayload = z.infer<typeof addSkillSchema>;
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;