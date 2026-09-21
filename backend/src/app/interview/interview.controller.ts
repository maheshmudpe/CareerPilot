import type { Request, Response } from "express";

import { createInterviewSchema, interviewIdSchema, updateInterviewSchema } from "./interview.schema.js";
import { createInterviewService , getInterviewsService, getInterviewService, updateInterviewService, deleteInterviewService } from "./interview.service.js";

export const createInterviewController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;


    const result = createInterviewSchema.safeParse(
        req.body
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid interview data",
            errors: result.error.issues,
        });
    }

    const interview = await createInterviewService(
        userId,
        result.data
    );

    return res.status(201).json({
        message: "Interview created successfully",
        interview,
    });
}


export const getInterviewsController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const interviews = await getInterviewsService(
        userId
    );

    return res.status(200).json({
        interviews,
    });
};



export const getInterviewController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = interviewIdSchema.safeParse(
        req.params
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid interview ID",
            errors: result.error.issues,
        });
    }

    const interview = await getInterviewService(
        userId,
        result.data.id
    );

    return res.status(200).json({
        interview,
    });
};



export const updateInterviewController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const paramsResult = interviewIdSchema.safeParse(
        req.params
    );

    if (!paramsResult.success) {
        return res.status(400).json({
            message: "Invalid interview ID",
            errors: paramsResult.error.issues,
        });
    }

    const bodyResult = updateInterviewSchema.safeParse(
        req.body
    );

    if (!bodyResult.success) {
        return res.status(400).json({
            message: "Invalid interview data",
            errors: bodyResult.error.issues,
        });
    }

    const interview = await updateInterviewService(
        userId,
        paramsResult.data.id,
        bodyResult.data
    );

    return res.status(200).json({
        message: "Interview updated successfully",
        interview,
    });
};


export const deleteInterviewController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = interviewIdSchema.safeParse(
        req.params
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid interview ID",
            errors: result.error.issues,
        });
    }

    await deleteInterviewService(
        userId,
        result.data.id
    );

    return res.status(200).json({
        message: "Interview deleted successfully",
    });
};