import type { Request, Response } from "express";

import { createApplicationService, deleteApplicationService, getApplicationService, getApplicationsService, updateApplicationService } from "./application.service.js";
import { applicationIdSchema, applicationQuerySchema, createApplicationSchema, updateApplicationSchema } from "./application.schema.js";

export const createApplicationController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = createApplicationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid application data",
            errors: result.error.issues,
        });
    }

    const application = await createApplicationService(
        userId,
        result.data
    );

    return res.status(201).json(application);
};


export const getApplicationsController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = applicationQuerySchema.safeParse(
        req.query
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid application query",
            errors: result.error.issues,
        });
    }

    const applications = await getApplicationsService(
        userId,
        result.data
    );

    return res.status(200).json(applications);
};




export const getApplicationController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = applicationIdSchema.safeParse(
        req.params
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid application ID",
            errors: result.error.issues,
        });
    }

    const application = await getApplicationService(
        userId,
        result.data.id
    );

    return res.status(200).json(application);
};





export const updateApplicationController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const idResult = applicationIdSchema.safeParse(
        req.params
    );

    if (!idResult.success) {
        return res.status(400).json({
            message: "Invalid application ID",
            errors: idResult.error.issues,
        });
    }

    const bodyResult = updateApplicationSchema.safeParse(
        req.body
    );

    if (!bodyResult.success) {
        return res.status(400).json({
            message: "Invalid application data",
            errors: bodyResult.error.issues,
        });
    }

    const application = await updateApplicationService(
        userId,
        idResult.data.id,
        bodyResult.data
    );

    return res.status(200).json(application);
};



export const deleteApplicationController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = applicationIdSchema.safeParse(
        req.params
    );

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid application ID",
            errors: result.error.issues,
        });
    }

    const response = await deleteApplicationService(
        userId,
        result.data.id
    );

    return res.status(200).json(response);
};