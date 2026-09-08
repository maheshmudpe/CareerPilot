import {Router  , type Router as ExpressRouter} from 'express';
import { registerController, loginController,meController } from './auth.controller.js';
import { asyncHandler } from '../../common/errors/asyncHandler.js';
import { authMiddleware } from '../../common/middleware/authMiddleware.js';



const authRouter:ExpressRouter = Router();


authRouter.post("/register",asyncHandler(registerController));

authRouter.post("/login" , asyncHandler(loginController))


authRouter.get(
    "/me",
    authMiddleware,
    asyncHandler(meController)
);




export default authRouter;