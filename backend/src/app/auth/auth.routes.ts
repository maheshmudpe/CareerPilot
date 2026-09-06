import {Router  , type Router as ExpressRouter} from 'express';
import { registerController } from './auth.controller.js';
import { asyncHandler } from '../../common/errors/asyncHandler.js';



const authRouter:ExpressRouter = Router();


authRouter.post("/register",asyncHandler(registerController ));




export default authRouter;