import api from "@/services/api";

import {
  applicationSchema,
  applicationListResponseSchema,
  createApplicationSchema,
  updateApplicationSchema,
  type Application,
  type CreateApplicationPayload,
  type UpdateApplicationPayload,
} from "./application.schema";

interface GetApplicationsParams {
  search?: string;
  status?: string;
  companyId?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "appliedAt" | "jobTitle";
  sortOrder?: "asc" | "desc";
}

export const getApplications = async (
  params: GetApplicationsParams = {}
) => {
  const response = await api.get("/applications", {
    params,
  });

  return applicationListResponseSchema.parse(
    response.data
  );
};

export const getApplication = async (
  applicationId: string
): Promise<Application> => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return applicationSchema.parse(response.data);
};

export const createApplication = async (
  payload: CreateApplicationPayload
): Promise<Application> => {
  const validatedPayload =
    createApplicationSchema.parse(payload);

  const response = await api.post(
    "/applications",
    validatedPayload
  );

  return applicationSchema.parse(response.data);
};

export const updateApplication = async (
  applicationId: string,
  payload: UpdateApplicationPayload
): Promise<Application> => {
  const validatedPayload =
    updateApplicationSchema.parse(payload);

  const response = await api.patch(
    `/applications/${applicationId}`,
    validatedPayload
  );

  return applicationSchema.parse(response.data);
};

export const deleteApplication = async (
  applicationId: string
) => {
  const response = await api.delete(
    `/applications/${applicationId}`
  );

  return response.data;
};