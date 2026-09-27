import jwt from "jsonwebtoken"
import type {NextFunction, Request, Response} from "express";
import { UnauthorizedError } from "../errors/HttpErrors.js";
import { env } from "../../config/env.js";



export const authMiddleware = (

    req:Request,
    res:Response,
    next:NextFunction


) => {


    const authHeader = req.headers.authorization;


    if(!authHeader){

        throw new UnauthorizedError("Authentication Required")
    }

    const [scheme , token ] =  authHeader.split(" ")

    if(scheme !== "Bearer" || !token){

        throw new UnauthorizedError("Invalid Authentication Header")
    }

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET ,  {
                algorithms: ["HS256"],
            });

            if (typeof decoded === "string") {
                throw new UnauthorizedError("Invalid authentication token");
            }

            if (typeof decoded.sub !== "string") {
                throw new UnauthorizedError("Invalid authentication token");
            }

            const userId = decoded.sub;

            req.user = {
                id: userId
            };

            next();

        } catch (error) {
            throw new UnauthorizedError("Invalid authentication token");
        }



}