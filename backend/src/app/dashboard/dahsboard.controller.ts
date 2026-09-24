import type { Request, Response } from "express";

import { getDashboard } from "./dashboard.service.js";

export const getDashboardController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user!.id;

  const dashboard = await getDashboard(userId);

  res.status(200).json(dashboard);
};