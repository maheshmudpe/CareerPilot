import { and, eq, exists, gt, ne, asc, desc } from "drizzle-orm";

import { db } from "../../db/index.js";
import {
    applicationsTable,
    interviewsTable,
} from "../../db/schema.js";

import type { CreateInterviewPayload, UpdateInterviewPayload } from "./interview.schema.js";
import { NotFoundError } from "../../common/errors/HttpErrors.js";

import type { InterviewQuery } from "./interview.schema.js";

export const createInterviewService = async (
    userId: string,
    payload: CreateInterviewPayload
) => {

    // 1. Verify that the application belongs to the user
    const [application] = await db
        .select({
            id: applicationsTable.id,
        })
        .from(applicationsTable)
        .where(
            and(
                eq(
                    applicationsTable.id,
                    payload.applicationId
                ),
                eq(
                    applicationsTable.userId,
                    userId
                )
            )
        );

    if (!application) {
        throw new NotFoundError(
            "Application not found"
        );
    }

    // 2. Create the interview
    const [interview] = await db
        .insert(interviewsTable)
        .values({
            applicationId: payload.applicationId,
            round: payload.round,
            scheduledAt: payload.scheduledAt,
            status: payload.status,
            interviewer: payload.interviewer,
            meetingUrl: payload.meetingUrl,
            notes: payload.notes,
        })
        .returning();

    return interview;
};



export const getInterviewsService = async (
    userId: string,
    query: InterviewQuery
) => {
    const conditions = [
        eq(
            applicationsTable.userId,
            userId
        ),
    ];

    if (query.status) {
        conditions.push(
            eq(
                interviewsTable.status,
                query.status
            )
        );
    }

    if (query.applicationId) {
        conditions.push(
            eq(
                interviewsTable.applicationId,
                query.applicationId
            )
        );
    }

    const sortColumn = {
        scheduledAt: interviewsTable.scheduledAt,
        createdAt: interviewsTable.createdAt,
    }[query.sortBy];

    const order =
        query.sortOrder === "asc"
            ? asc(sortColumn)
            : desc(sortColumn);

    const interviews = await db
        .select({
            id: interviewsTable.id,
            applicationId: interviewsTable.applicationId,
            round: interviewsTable.round,
            scheduledAt: interviewsTable.scheduledAt,
            status: interviewsTable.status,
            interviewer: interviewsTable.interviewer,
            meetingUrl: interviewsTable.meetingUrl,
            notes: interviewsTable.notes,
            feedback: interviewsTable.feedback,
            createdAt: interviewsTable.createdAt,
            updatedAt: interviewsTable.updatedAt,
        })
        .from(interviewsTable)
        .innerJoin(
            applicationsTable,
            eq(
                interviewsTable.applicationId,
                applicationsTable.id
            )
        )
        .where(and(...conditions))
        .orderBy(order);

    return interviews;
};



export const getInterviewService = async (
    userId: string,
    interviewId: string
) => {
    const [interview] = await db
        .select({
            id: interviewsTable.id,
            applicationId: interviewsTable.applicationId,
            round: interviewsTable.round,
            scheduledAt: interviewsTable.scheduledAt,
            status: interviewsTable.status,
            interviewer: interviewsTable.interviewer,
            meetingUrl: interviewsTable.meetingUrl,
            notes: interviewsTable.notes,
            feedback: interviewsTable.feedback,
            createdAt: interviewsTable.createdAt,
            updatedAt: interviewsTable.updatedAt,
        })
        .from(interviewsTable)
        .innerJoin(
            applicationsTable,
            eq(
                interviewsTable.applicationId,
                applicationsTable.id
            )
        )
        .where(
            and(
                eq(interviewsTable.id, interviewId),
                eq(applicationsTable.userId, userId)
            )
        );

    if (!interview) {
        throw new NotFoundError(
            "Interview not found"
        );
    }

    return interview;
};




export const updateInterviewService = async (
    userId: string,
    interviewId: string,
    payload: UpdateInterviewPayload
) => {
    const [interview] = await db
        .update(interviewsTable)
        .set({
            ...payload,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(interviewsTable.id, interviewId),
                exists(
                    db
                        .select({
                            id: applicationsTable.id,
                        })
                        .from(applicationsTable)
                        .where(
                            and(
                                eq(
                                    applicationsTable.id,
                                    interviewsTable.applicationId
                                ),
                                eq(
                                    applicationsTable.userId,
                                    userId
                                )
                            )
                        )
                )
            )
        )
        .returning();

    if (!interview) {
        throw new NotFoundError(
            "Interview not found"
        );
    }

    return interview;
};



export const deleteInterviewService = async (
    userId: string,
    interviewId: string
) => {
    const [interview] = await db
        .select({
            id: interviewsTable.id,
            applicationId: interviewsTable.applicationId,
        })
        .from(interviewsTable)
        .innerJoin(
            applicationsTable,
            eq(
                interviewsTable.applicationId,
                applicationsTable.id
            )
        )
        .where(
            and(
                eq(interviewsTable.id, interviewId),
                eq(applicationsTable.userId, userId)
            )
        );

    if (!interview) {
        throw new NotFoundError(
            "Interview not found"
        );
    }

    await db
        .delete(interviewsTable)
        .where(
            eq(
                interviewsTable.id,
                interview.id
            )
        );
};



export const getUpcomingInterviewsService = async (
    userId: string
) => {
    const now = new Date();

    const interviews = await db
        .select({
            id: interviewsTable.id,
            applicationId: interviewsTable.applicationId,
            round: interviewsTable.round,
            scheduledAt: interviewsTable.scheduledAt,
            status: interviewsTable.status,
            interviewer: interviewsTable.interviewer,
            meetingUrl: interviewsTable.meetingUrl,
            notes: interviewsTable.notes,
            feedback: interviewsTable.feedback,
            createdAt: interviewsTable.createdAt,
            updatedAt: interviewsTable.updatedAt,
        })
        .from(interviewsTable)
        .innerJoin(
            applicationsTable,
            eq(
                interviewsTable.applicationId,
                applicationsTable.id
            )
        )
        .where(
            and(
                eq(
                    applicationsTable.userId,
                    userId
                ),
                gt(
                    interviewsTable.scheduledAt,
                    now
                ),
                ne(
                    interviewsTable.status,
                    "CANCELLED"
                ),
                ne(
                    interviewsTable.status,
                    "COMPLETED"
                )
            )
        )
        .orderBy(
            asc(interviewsTable.scheduledAt)
        );

    return interviews;
};