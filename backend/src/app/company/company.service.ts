import { and, eq, ilike, count, desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
    companiesTable,
    applicationsTable,
} from "../../db/schema.js";
import {
    NotFoundError,
    ConflictError,
    BadRequestError,
} from "../../common/errors/HttpErrors.js";
import type {
    CreateCompanyPayload,
    UpdateCompanyPayload,
    CompanyQuery,
} from "./company.schema.js";



export const createCompanyService = async (
    userId: string,
    payload: CreateCompanyPayload
) => {
    const [existingCompany] = await db
        .select()
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.userId, userId),
                eq(companiesTable.name, payload.name)
            )
        );

    if (existingCompany) {
        throw new ConflictError(
            "Company with this name already exists"
        );
    }

    const [company] = await db
        .insert(companiesTable)
        .values({
            userId,
            ...payload,
        })
        .returning();

    if (!company) {
        throw new Error("Failed to create company");
    }

    return company;
};



export const getCompaniesService = async (
    userId: string,
    query: CompanyQuery
) => {
    const conditions = [
        eq(companiesTable.userId, userId),
    ];

    if (query.location) {
        conditions.push(
            eq(companiesTable.location, query.location)
        );
    }

    if (query.industry) {
        conditions.push(
            eq(companiesTable.industry, query.industry)
        );
    }

    if (query.search) {
        conditions.push(
            ilike(
                companiesTable.name,
                `%${query.search}%`
            )
        );
    }

    const offset = (query.page - 1) * query.limit;

    const companies = await db
        .select()
        .from(companiesTable)
        .where(and(...conditions))
        .orderBy(desc(companiesTable.createdAt))
        .limit(query.limit)
        .offset(offset);

    const [countResult] = await db
        .select({
            count: count(),
        })
        .from(companiesTable)
        .where(and(...conditions));

    const total = Number(countResult?.count ?? 0);

    const totalPages = Math.ceil(
        total / query.limit
    );

    return {
        companies,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
        },
    };
};


export const getCompanyService = async (
    userId: string,
    companyId: string
) => {
    const [company] = await db
        .select()
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, userId)
            )
        );

    if (!company) {
        throw new NotFoundError("Company not found");
    }

    return company;
};



export const updateCompanyService = async (
    userId: string,
    companyId: string,
    payload: UpdateCompanyPayload
) => {
    const [updatedCompany] = await db
        .update(companiesTable)
        .set({
            ...payload,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, userId)
            )
        )
        .returning();

    if (!updatedCompany) {
        throw new NotFoundError("Company not found");
    }

    return updatedCompany;
};



export const deleteCompanyService = async (
    userId: string,
    companyId: string
) => {
    const [company] = await db
        .select()
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, userId)
            )
        );

    if (!company) {
        throw new NotFoundError("Company not found");
    }

    const [application] = await db
        .select({
            id: applicationsTable.id,
        })
        .from(applicationsTable)
        .where(
            eq(applicationsTable.companyId, companyId)
        )
        .limit(1);

    if (application) {
        throw new BadRequestError(
            "Cannot delete a company with existing applications"
        );
    }

    await db
        .delete(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, userId)
            )
        );

    return {
        message: "Company deleted successfully",
    };
};