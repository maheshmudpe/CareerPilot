import { z } from "zod";

export const profileSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  fullName: z.string(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  bio: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.url("Enter a valid LinkedIn URL").optional(),
  githubUrl: z.url("Enter a valid GitHub URL").optional(),
});

export const skillSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const skillsResponseSchema = z.object({
  skills: z.array(skillSchema),
});

export const addSkillResponseSchema = skillSchema;

export const removeSkillResponseSchema = z.object({
  message: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
export type Skill = z.infer<typeof skillSchema>;