import { z } from "zod";

const applicationStatusSchema = z.enum([
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

const interviewStatusSchema = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
]);

const dashboardApplicationSchema = z.object({
  id: z.uuid(),
  jobTitle: z.string(),
  status: applicationStatusSchema,
  appliedAt: z.coerce.date().nullable(),

  company: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
});

const dashboardInterviewSchema = z.object({
  id: z.uuid(),
  round: z.string(),
  scheduledAt: z.coerce.date().nullable(),
  status: interviewStatusSchema,

  application: z.object({
    id: z.uuid(),
    jobTitle: z.string(),
  }),

  company: z.object({
    id: z.uuid(),
    name: z.string(),
  }),
});

export const dashboardResponseSchema = z.object({
  statistics: z.object({
    totalApplications: z.number(),
    totalInterviews: z.number(),
    offers: z.number(),
    rejected: z.number(),
  }),

  applicationsByStatus: z.object({
    SAVED: z.number(),
    APPLIED: z.number(),
    SCREENING: z.number(),
    INTERVIEW: z.number(),
    OFFER: z.number(),
    ACCEPTED: z.number(),
    REJECTED: z.number(),
    WITHDRAWN: z.number(),
  }),

  recentApplications: z.array(
    dashboardApplicationSchema,
  ),

  upcomingInterviews: z.array(
    dashboardInterviewSchema,
  ),
});

export type DashboardResponse = z.infer<
  typeof dashboardResponseSchema
>;