import { Router,  type Router as ExpressRouter } from 'express';
import { asyncHandler } from "../../common/errors/asyncHandler.js";
import { authMiddleware } from '../../common/middleware/authMiddleware.js';
import { createCompanyController, deleteCompanyController, getCompaniesController, getCompanyController, updateCompanyController } from './company.controller.js';



const companyRouter:ExpressRouter = Router()



companyRouter.post("/" , authMiddleware, asyncHandler(createCompanyController))


companyRouter.get("/" , authMiddleware , asyncHandler(getCompaniesController))

companyRouter.get("/:id" , authMiddleware , asyncHandler(getCompanyController))


companyRouter.patch("/:id" ,authMiddleware , asyncHandler(updateCompanyController))


companyRouter.delete("/:id" , authMiddleware, asyncHandler(deleteCompanyController))




export default companyRouter;