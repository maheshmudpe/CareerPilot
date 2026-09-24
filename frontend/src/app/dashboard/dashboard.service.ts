import api from "@/services/api";

import {
  dashboardResponseSchema,
  type DashboardResponse,
} from "./dashboard.schema";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const response = await api.get("/dashboard");

  return dashboardResponseSchema.parse(response.data);
};