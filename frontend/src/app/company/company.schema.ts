import { z } from "zod";

export const companySchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z.string(),
  website: z.string().nullable(),
  location: z.string().nullable(),
  industry: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  website: z.url("Enter a valid website URL").optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required").optional(),
  website: z.url("Enter a valid website URL").optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export const companyListResponseSchema = z.object({
  companies: z.array(companySchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const deleteCompanyResponseSchema = z.object({
  message: z.string(),
});

export type Company = z.infer<typeof companySchema>;
export type CreateCompanyPayload = z.infer<typeof createCompanySchema>;
export type UpdateCompanyPayload = z.infer<typeof updateCompanySchema>;