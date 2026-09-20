import type { Request, Response } from "express";

import {
    createCompanyService,
    getCompaniesService,
    updateCompanyService,
    deleteCompanyService,
    getCompanyService,
} from "./company.service.js";

import {
    createCompanySchema,
    updateCompanySchema,
    companyIdSchema,
    companyQuerySchema,
} from "./company.schema.js";


export const createCompanyController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = createCompanySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid company data",
            errors: result.error.issues,
        });
    }

    const company = await createCompanyService(
        userId,
        result.data
    );

    return res.status(201).json(company);
};



export const getCompaniesController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = companyQuerySchema.safeParse(req.query);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid company query",
            errors: result.error.issues,
        });
    }

    const resultData = await getCompaniesService(
        userId,
        result.data
    );

    return res.status(200).json(resultData);
};


export const getCompanyController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = companyIdSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid company ID",
            errors: result.error.issues,
        });
    }

    const company = await getCompanyService(
        userId,
        result.data.id
    );

    return res.status(200).json(company);
};


export const updateCompanyController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const idResult = companyIdSchema.safeParse(req.params);

    if (!idResult.success) {
        return res.status(400).json({
            message: "Invalid company ID",
            errors: idResult.error.issues,
        });
    }

    const bodyResult = updateCompanySchema.safeParse(req.body);

    if (!bodyResult.success) {
        return res.status(400).json({
            message: "Invalid company data",
            errors: bodyResult.error.issues,
        });
    }

    const company = await updateCompanyService(
        userId,
        idResult.data.id,
        bodyResult.data
    );

    return res.status(200).json(company);
};


export const deleteCompanyController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user!.id;

    const result = companyIdSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid company ID",
            errors: result.error.issues,
        });
    }

    const response = await deleteCompanyService(
        userId,
        result.data.id
    );

    return res.status(200).json(response);
};
