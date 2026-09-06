import type{ NextFunction , Request, Response } from "express";

import { AppError } from "./AppError.js";
import { ZodError } from "zod";


export const errorHandler = (

    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
) => {

    if (err instanceof ZodError) {
       return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        })),
    });
    
    }

    if(err instanceof AppError){

        return res.status(err.statusCode).json({

            success:false,
            message:err.message
        })
    }


    return res.status(500).json({
        success:false,
        message:"internal server error"
    })
}