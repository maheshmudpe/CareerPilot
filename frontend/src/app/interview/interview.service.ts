import api from "@/services/api";

import {
  createInterviewResponseSchema,
  createInterviewSchema,
  deleteInterviewResponseSchema,
  interviewListResponseSchema,
  updateInterviewSchema,
  getInterviewResponseSchema,
  updateInterviewResponseSchema,
  type CreateInterviewPayload,
  type Interview,
  type UpdateInterviewPayload,
} from "./interview.schema";


/* -------------------------------------------------- */
/* Query Parameters */
/* -------------------------------------------------- */

export interface GetInterviewsParams {
  status?:
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED"
    | "RESCHEDULED";

  applicationId?: string;

  sortBy?:
    | "scheduledAt"
    | "createdAt";

  sortOrder?:
    | "asc"
    | "desc";
}


/* -------------------------------------------------- */
/* Get Interviews */
/* -------------------------------------------------- */

export const getInterviews = async (
  params: GetInterviewsParams = {}
): Promise<Interview[]> => {
  const response = await api.get(
    "/interviews",
    {
      params,
    }
  );

  const result =
    interviewListResponseSchema.parse(
      response.data
    );

  return result.interviews;
};


/* -------------------------------------------------- */
/* Get Single Interview */
/* -------------------------------------------------- */

export const getInterview = async (
  interviewId: string
): Promise<Interview> => {
  const response = await api.get(
    `/interviews/${interviewId}`
  );

  const result =
    getInterviewResponseSchema.parse(
      response.data
    );

  return result.interview;
};

/* -------------------------------------------------- */
/* Create Interview */
/* -------------------------------------------------- */

export const createInterview = async (
  payload: CreateInterviewPayload
): Promise<Interview> => {
  const validatedPayload =
    createInterviewSchema.parse(payload);

  const response = await api.post(
    "/interviews",
    validatedPayload
  );

  const result =
    createInterviewResponseSchema.parse(
      response.data
    );

  return result.interview;
};


/* -------------------------------------------------- */
/* Update Interview */
/* -------------------------------------------------- */

export const updateInterview = async (
  interviewId: string,
  payload: UpdateInterviewPayload
): Promise<Interview> => {
  const validatedPayload =
    updateInterviewSchema.parse(payload);

  const response = await api.patch(
    `/interviews/${interviewId}`,
    validatedPayload
  );

  const result =
    updateInterviewResponseSchema.parse(
      response.data
    );

  return result.interview;
};


/* -------------------------------------------------- */
/* Delete Interview */
/* -------------------------------------------------- */

export const deleteInterview = async (
  interviewId: string
) => {
  const response = await api.delete(
    `/interviews/${interviewId}`
  );

  return deleteInterviewResponseSchema.parse(
    response.data
  );
};


/* -------------------------------------------------- */
/* Get Upcoming Interviews */
/* -------------------------------------------------- */

export const getUpcomingInterviews =
  async (): Promise<Interview[]> => {
    const response = await api.get(
      "/interviews/upcoming"
    );

    const result =
      interviewListResponseSchema.parse(
        response.data
      );

    return result.interviews;
  };