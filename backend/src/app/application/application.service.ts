import { and, eq, count, desc } from "drizzle-orm";

import { db } from "../../db/index.js";
import { companiesTable, applicationsTable } from "../../db/schema.js";

import type { CreateApplicationPayload, UpdateApplicationPayload , ApplicationQuery } from "./application.schema.js";
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



export const getApplicationsService = async (
    userId: string,
    query: ApplicationQuery
) => {
    const offset = (query.page - 1) * query.limit;

    const applications = await db
        .select()
        .from(applicationsTable)
        .where(
            eq(applicationsTable.userId, userId)
        )
        .orderBy(
            desc(applicationsTable.createdAt)
        )
        .limit(query.limit)
        .offset(offset);

    const [countResult] = await db
        .select({
            count: count(),
        })
        .from(applicationsTable)
        .where(
            eq(applicationsTable.userId, userId)
        );

    const total = Number(countResult?.count ?? 0);

    const totalPages = Math.ceil(
        total / query.limit
    );

    return {
        applications,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
        },
    };
};



export const getApplicationService = async (
    userId: string,
    applicationId: string
) => {
    const [application] = await db
        .select()
        .from(applicationsTable)
        .where(
            and(
                eq(applicationsTable.id, applicationId),
                eq(applicationsTable.userId, userId)
            )
        );

    if (!application) {
        throw new NotFoundError(
            "Application not found"
        );
    }

    return application;
};



export const updateApplicationService = async (
    userId: string,
    applicationId: string,
    payload: UpdateApplicationPayload
) => {
    const [application] = await db
        .update(applicationsTable)
        .set({
            ...payload,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(applicationsTable.id, applicationId),
                eq(applicationsTable.userId, userId)
            )
        )
        .returning();

    if (!application) {
        throw new NotFoundError(
            "Application not found"
        );
    }

    return application;
};



export const deleteApplicationService = async (
    userId: string,
    applicationId: string
) => {
    const [application] = await db
        .delete(applicationsTable)
        .where(
            and(
                eq(applicationsTable.id, applicationId),
                eq(applicationsTable.userId, userId)
            )
        )
        .returning({
            id: applicationsTable.id,
        });

    if (!application) {
        throw new NotFoundError(
            "Application not found"
        );
    }

    return {
        message: "Application deleted successfully",
    };
};