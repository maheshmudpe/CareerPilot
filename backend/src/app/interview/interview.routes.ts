import { Router, type Router as ExpressRouter } from "express";

import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { asyncHandler } from "../../common/errors/asyncHandler.js";

import {
    createInterviewController,
    getInterviewsController,
    getInterviewController,
    updateInterviewController,
    deleteInterviewController,
    getUpcomingInterviewsController,
} from "./interview.controller.js";

const interviewRouter: ExpressRouter = Router();

interviewRouter.post(
    "/",
    authMiddleware,
    asyncHandler(createInterviewController)
);

interviewRouter.get(
    "/",
    authMiddleware,
    asyncHandler(getInterviewsController)
);

interviewRouter.get(
    "/upcoming",
    authMiddleware,
    asyncHandler(getUpcomingInterviewsController)
);

interviewRouter.get(
    "/:id",
    authMiddleware,
    asyncHandler(getInterviewController)
);

interviewRouter.patch(
    "/:id",
    authMiddleware,
    asyncHandler(updateInterviewController)
);

interviewRouter.delete(
    "/:id",
    authMiddleware,
    asyncHandler(deleteInterviewController)
);

export default interviewRouter;

