import type { Request , Response } from "express";

import { registerSchema } from "./auth.schema.js";

import { registerUser } from "./auth.service.js";


export const registerController = async  (req:Request , res:Response) => {

    const result = registerSchema.safeParse(req.body)


    if(!result.success){

        return res.status(400).json({
            message: "Invalid Registration data",
            error:result.error.issues
        })
    }

   const user = await registerUser(result.data);

   return res.status(201).json(user);
  
}


