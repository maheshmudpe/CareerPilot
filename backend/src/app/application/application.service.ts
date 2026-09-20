import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { companiesTable, applicationsTable } from "../../db/schema.js";

import type { CreateApplicationPayload } from "./application.schema.js";
import { NotFoundError } from "../../common/errors/HttpErrors.js";

export const createApplicationService = async (
    userId: string,
    payload: CreateApplicationPayload
) => {
    // 1. Verify that the company belongs to the authenticated user
    const [company] = await db
        .select({
            id: companiesTable.id,
        })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, payload.companyId),
                eq(companiesTable.userId, userId)
            )
        );

    if (!company) {
        throw new NotFoundError("Company not found");
    }

    // 2. Create the application
    const [application] = await db
        .insert(applicationsTable)
        .values({
            userId,
            companyId: payload.companyId,
            jobTitle: payload.jobTitle,
            jobDescription: payload.jobDescription,
            jobUrl: payload.jobUrl,
            status: payload.status,
            appliedAt: payload.appliedAt,
            salary: payload.salary,
            location: payload.location,
            employmentType: payload.employmentType,
            notes: payload.notes,
        })
        .returning();

    return application;
};