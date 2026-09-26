import { z } from "zod";

/* -------------------------------------------------- */
/* Interview Status */
/* -------------------------------------------------- */

export const interviewStatusSchema = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
]);

export type InterviewStatus = z.infer<
  typeof interviewStatusSchema
>;


/* -------------------------------------------------- */
/* Interview Response */
/* -------------------------------------------------- */

export const interviewSchema = z.object({
  id: z.uuid(),

  applicationId: z.uuid(),

  round: z.string(),

  scheduledAt: z.coerce.date().nullable(),

  status: interviewStatusSchema,

  interviewer: z.string().nullable(),

  meetingUrl: z.string().nullable(),

  notes: z.string().nullable(),

  feedback: z.string().nullable(),

  createdAt: z.coerce.date(),

  updatedAt: z.coerce.date(),
});

export type Interview = z.infer<
  typeof interviewSchema
>;


/* -------------------------------------------------- */
/* Interview List Response */
/* -------------------------------------------------- */

export const interviewListResponseSchema = z.object({
  interviews: z.array(interviewSchema),
});


/* -------------------------------------------------- */
/* Create Interview API Payload */
/* -------------------------------------------------- */

export const createInterviewSchema = z.object({
  applicationId: z.uuid(
    "Please select an application"
  ),

  round: z
    .string()
    .trim()
    .min(1, "Interview round is required"),

  scheduledAt: z.coerce.date().optional(),

  status: interviewStatusSchema,

  interviewer: z
    .string()
    .trim()
    .optional(),

  meetingUrl: z
    .url("Enter a valid meeting URL")
    .optional(),

  notes: z.string().optional(),
});

export type CreateInterviewPayload = z.infer<
  typeof createInterviewSchema
>;


/* -------------------------------------------------- */
/* Create Interview Response */
/* -------------------------------------------------- */

export const createInterviewResponseSchema =
  z.object({
    message: z.string(),

    interview: interviewSchema,
  });


/* -------------------------------------------------- */
/* Update Interview API Payload */
/* -------------------------------------------------- */

export const updateInterviewSchema = z.object({
  round: z
    .string()
    .trim()
    .min(1, "Interview round is required")
    .optional(),

  scheduledAt: z.coerce.date().optional(),

  status: interviewStatusSchema.optional(),

  interviewer: z
    .string()
    .trim()
    .optional(),

  meetingUrl: z
    .url("Enter a valid meeting URL")
    .optional(),

  notes: z.string().optional(),

  feedback: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  }
);

export type UpdateInterviewPayload = z.infer<
  typeof updateInterviewSchema
>;


/* -------------------------------------------------- */
/* Interview Form */
/* -------------------------------------------------- */

export const interviewFormSchema = z.object({
  applicationId: z.uuid(
    "Please select an application"
  ),

  round: z
    .string()
    .trim()
    .min(1, "Interview round is required"),

  scheduledAt: z.string(),

  status: interviewStatusSchema,

  interviewer: z.string(),

  meetingUrl: z.union([
    z.url("Enter a valid meeting URL"),
    z.literal(""),
  ]),

  notes: z.string(),

  feedback: z.string(),
});

export type InterviewFormValues = z.infer<
  typeof interviewFormSchema
>;


/* -------------------------------------------------- */
/* Interview Query */
/* -------------------------------------------------- */

export const interviewQuerySchema = z.object({
  status: interviewStatusSchema.optional(),

  applicationId: z.uuid().optional(),

  sortBy: z
    .enum([
      "scheduledAt",
      "createdAt",
    ])
    .default("scheduledAt"),

  sortOrder: z
    .enum([
      "asc",
      "desc",
    ])
    .default("asc"),
});

export type InterviewQuery = z.infer<
  typeof interviewQuerySchema
>;


export const getInterviewResponseSchema = z.object({
  interview: interviewSchema,
});


/* -------------------------------------------------- */
/* Delete Interview Response */
/* -------------------------------------------------- */

export const deleteInterviewResponseSchema =
  z.object({
    message: z.string(),
  });


  export const updateInterviewResponseSchema = z.object({
  message: z.string(),
  interview: interviewSchema,
});