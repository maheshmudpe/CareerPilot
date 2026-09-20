import type { Request, Response } from "express";

import { createApplicationService } from "./application.service.js";
import { createApplicationSchema } from "./application.schema.js";

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