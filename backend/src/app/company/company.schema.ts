import { z } from "zod";

export const createCompanySchema = z.object({
    name: z.string().trim().min(1),
    website: z.url().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    notes: z.string().optional(),
});

export const updateCompanySchema = z.object({
    name: z.string().trim().min(1).optional(),
    website: z.url().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    notes: z.string().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);

export const companyIdSchema = z.object({
    id: z.uuid(),
});


export const companyQuerySchema = z.object({
    search: z.string().trim().optional(),
    location: z.string().trim().optional(),
    industry: z.string().trim().optional(),

    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});


export type CompanyQuery = z.infer<typeof companyQuerySchema>;

export type CreateCompanyPayload = z.infer<typeof createCompanySchema>;

export type UpdateCompanyPayload = z.infer<typeof updateCompanySchema>;

export type CompanyIdParams = z.infer<typeof companyIdSchema>;