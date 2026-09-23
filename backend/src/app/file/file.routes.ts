import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { asyncHandler } from "../../common/errors/asyncHandler.js";
import { upload } from "../../common/middleware/uploadMiddleware.js";
import { uploadFileController } from "./file.controller.js";

const fileRouter: ExpressRouter = Router();

fileRouter.post(
    "/",
    authMiddleware,
    upload.single("file"),
    asyncHandler(uploadFileController)
);

export default fileRouter;