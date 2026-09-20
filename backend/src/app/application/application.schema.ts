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