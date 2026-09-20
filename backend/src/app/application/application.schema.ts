import { z } from "zod";

export const createApplicationSchema = z.object({
    companyId: z.uuid(),

    jobTitle: z.string().trim().min(1),

    jobDescription: z.string().optional(),

    jobUrl: z.url().optional(),

    status: z.enum([
        "SAVED",
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
    ]).default("APPLIED"),

    appliedAt: z.coerce.date().optional(),

    salary: z.string().optional(),

    location: z.string().optional(),

    employmentType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
    ]).optional(),

    notes: z.string().optional(),
});

export type CreateApplicationPayload = z.infer<
    typeof createApplicationSchema
>;


export const applicationIdSchema = z.object({
    id: z.uuid(),
});

export type ApplicationIdParams = z.infer<
    typeof applicationIdSchema
>;


export const updateApplicationSchema = z.object({
    companyId: z.uuid().optional(),

    jobTitle: z.string().trim().min(1).optional(),

    jobDescription: z.string().optional(),

    jobUrl: z.url().optional(),

    status: z.enum([
        "SAVED",
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
    ]).optional(),

    appliedAt: z.coerce.date().optional(),

    salary: z.string().optional(),

    location: z.string().optional(),

    employmentType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
    ]).optional(),

    notes: z.string().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required",
    }
);

export type UpdateApplicationPayload = z.infer<
    typeof updateApplicationSchema
>;


export const applicationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ApplicationQuery = z.infer<
    typeof applicationQuerySchema
>;