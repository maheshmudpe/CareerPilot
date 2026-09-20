import {Router , type Router as ExpressRouter } from 'express';

import { authMiddleware } from '../../common/middleware/authMiddleware.js';
import { createApplicationController, deleteApplicationController, getApplicationController, getApplicationsController, updateApplicationController,  } from './application.controller.js';
import { asyncHandler } from '../../common/errors/asyncHandler.js';


const applicationRouter:ExpressRouter = Router();


applicationRouter.post("/" , authMiddleware, asyncHandler(createApplicationController))


applicationRouter.get("/", authMiddleware , asyncHandler(getApplicationsController))


applicationRouter.get("/:id" , authMiddleware , asyncHandler(getApplicationController))


applicationRouter.patch("/:id" , authMiddleware , asyncHandler(updateApplicationController))


applicationRouter.delete("/:id" , authMiddleware , asyncHandler(deleteApplicationController))


export default applicationRouter;