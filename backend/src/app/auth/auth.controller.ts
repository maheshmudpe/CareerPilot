import type { Request , Response } from "express";

import { registerSchema , loginSchema } from "./auth.schema.js";

import { registerUser, loginService } from "./auth.service.js";


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


export const loginController = async(req:Request, res:Response) => {


    const result = loginSchema.safeParse(req.body)

    if(!result.success){

        return res.status(400).json({

            message:"please enter in correct format"

        })

    }

    const user = await loginService(result.data)

    return res.status(200).json(user)
    

}


export const meController = async (req: Request, res: Response) => {
    return res.status(200).json({
        userId: req.user?.id
    });
    
};


