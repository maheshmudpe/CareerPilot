import api from "@/services/api";

import {
  companyListResponseSchema,
  companySchema,
  createCompanySchema,
  deleteCompanyResponseSchema,
  updateCompanySchema,
  type Company,
  type CreateCompanyPayload,
  type UpdateCompanyPayload,
} from "./company.schema";

interface GetCompaniesParams {
  search?: string;
  location?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

export const getCompanies = async (
  params: GetCompaniesParams = {},
) => {
  const response = await api.get("/companies", {
    params,
  });

  return companyListResponseSchema.parse(response.data);
};

export const getCompany = async (
  companyId: string,
): Promise<Company> => {
  const response = await api.get(`/companies/${companyId}`);

  return companySchema.parse(response.data);
};

export const createCompany = async (
  payload: CreateCompanyPayload,
): Promise<Company> => {
  const validatedPayload = createCompanySchema.parse(payload);

  const response = await api.post(
    "/companies",
    validatedPayload,
  );

  return companySchema.parse(response.data);
};

export const updateCompany = async (
  companyId: string,
  payload: UpdateCompanyPayload,
): Promise<Company> => {
  const validatedPayload = updateCompanySchema.parse(payload);

  const response = await api.patch(
    `/companies/${companyId}`,
    validatedPayload,
  );

  return companySchema.parse(response.data);
};

export const deleteCompany = async (
  companyId: string,
) => {
  const response = await api.delete(
    `/companies/${companyId}`,
  );

  return deleteCompanyResponseSchema.parse(response.data);
};