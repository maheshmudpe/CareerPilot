import {Router , type Router as ExpressRouter } from 'express';

import { authMiddleware } from '../../common/middleware/authMiddleware.js';
import { createApplicationController } from './application.controller.js';
import { asyncHandler } from '../../common/errors/asyncHandler.js';

const applicationRouter:ExpressRouter = Router();


applicationRouter.post("/" , authMiddleware, asyncHandler(createApplicationController))


export default applicationRouter;