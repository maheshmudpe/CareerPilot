import { z } from "zod";

export const createInterviewSchema = z.object({
    applicationId: z.uuid(),

    round: z.string().trim().min(1),

    scheduledAt: z.coerce.date().optional(),

    status: z.enum([
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
    ]).default("SCHEDULED"),

    interviewer: z.string().trim().optional(),

    meetingUrl: z.url().optional(),

    notes: z.string().optional(),
});

export const updateInterviewSchema = z.object({
    round: z.string().trim().min(1).optional(),

    scheduledAt: z.coerce.date().optional(),

    status: z.enum([
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
    ]).optional(),

    interviewer: z.string().trim().optional(),

    meetingUrl: z.url().optional(),

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

export const interviewIdSchema = z.object({
    id: z.uuid(),
});

export type InterviewIdParams = z.infer<
    typeof interviewIdSchema
>;

export type CreateInterviewPayload = z.infer<
    typeof createInterviewSchema
>;