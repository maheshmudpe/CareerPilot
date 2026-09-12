import type { Request, Response } from "express";
import { updateProfileSchema } from "./profile.schema.js";
import { addSkillSchema } from "./profile.schema.js";
import { skillIdSchema } from "./profile.schema.js";
import {
    addSkillService,
    getProfileService,
    getSkillsService,
    removeSkillService,
    updateProfileService
} from "./profile.service.js";

export const getProfileController = async (

    req: Request,
    res: Response,

) => {


    const userId = req.user!.id;


    const profile = await getProfileService(userId)

    return res.status(200).json(profile);
}


export const updateProfileController = async (

    req: Request,
    res: Response
) => {


    const userId = req.user!.id;

    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid profile data",
            errors: result.error.issues,
        });
    }

    const profile = await updateProfileService(
        userId,
        result.data
    );

    return res.status(200).json(profile);



}


export const getSkillsController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const skills = await getSkillsService(userId);

    return res.status(200).json({
        skills,
    });
};



export const addSkillController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = addSkillSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid skill data",
            errors: result.error.issues,
        });
    }

    const skill = await addSkillService(
        userId,
        result.data
    );

    return res.status(201).json(skill);
};



export const removeSkillController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = skillIdSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid skill ID",
            errors: result.error.issues,
        });
    }

    const resultData = await removeSkillService(
        userId,
        result.data.skillId
    );

    return res.status(200).json(resultData);
};