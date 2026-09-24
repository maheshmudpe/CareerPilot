import { Router, type Router as ExpressRouter } from "express";

import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { asyncHandler } from "../../common/errors/asyncHandler.js";


import { getDashboardController } from "./dahsboard.controller.js";


const dashboardRouter:ExpressRouter = Router();

dashboardRouter.get(
  "/",
  authMiddleware,
  asyncHandler(getDashboardController),
);

export default dashboardRouter;