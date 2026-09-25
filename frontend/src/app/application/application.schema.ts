import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
]);

export const applicationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  companyId: z.uuid(),

  jobTitle: z.string(),
  jobDescription: z.string().nullable(),
  jobUrl: z.string().nullable(),

  status: applicationStatusSchema,

  appliedAt: z.coerce.date().nullable(),

  salary: z.string().nullable(),
  location: z.string().nullable(),

  employmentType: employmentTypeSchema.nullable(),

  notes: z.string().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createApplicationSchema = z.object({
  companyId: z.uuid("Please select a company"),

  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required"),

  jobDescription: z.string().optional(),

  jobUrl: z
    .url("Enter a valid job URL")
    .optional(),

  status: applicationStatusSchema,

  appliedAt: z.coerce.date().optional(),

  salary: z.string().optional(),

  location: z.string().optional(),

  employmentType: employmentTypeSchema.optional(),

  notes: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  companyId: z.uuid().optional(),

  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .optional(),

  jobDescription: z.string().optional(),

  jobUrl: z
    .url("Enter a valid job URL")
    .optional(),

  status: applicationStatusSchema.optional(),

  appliedAt: z.coerce.date().optional(),

  salary: z.string().optional(),

  location: z.string().optional(),

  employmentType: employmentTypeSchema.optional(),

  notes: z.string().optional(),
});

export const applicationFormSchema = z.object({
  companyId: z
    .uuid("Please select a company"),

  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required"),

  jobDescription: z
    .string(),

  jobUrl: z
    .union([
      z.url("Enter a valid job URL"),
      z.literal(""),
    ]),

  status: applicationStatusSchema,

  appliedAt: z.string(),

  salary: z.string(),

  location: z.string(),

  employmentType: z.union([
    employmentTypeSchema,
    z.literal(""),
  ]),

  notes: z.string(),
});

export const applicationListResponseSchema = z.object({
  applications: z.array(applicationSchema),

  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ApplicationListResponse = z.infer<
  typeof applicationListResponseSchema
>;


export type Application = z.infer<
  typeof applicationSchema
>;

export type CreateApplicationPayload = z.infer<
  typeof createApplicationSchema
>;

export type UpdateApplicationPayload = z.infer<
  typeof updateApplicationSchema
>;

export type ApplicationFormValues = z.infer<
  typeof applicationFormSchema
>;