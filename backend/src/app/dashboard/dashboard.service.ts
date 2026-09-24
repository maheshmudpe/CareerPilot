import { and, count, desc, eq, sql } from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  applicationsTable,
  companiesTable,
  interviewsTable,
} from "../../db/schema.js";

import type { DashboardResponse } from "./dashboard.schema.js";

export const getDashboard = async (
  userId: string,
): Promise<DashboardResponse> => {
  // 1. Overall application statistics
  const applicationStats = (
    await db
      .select({
        totalApplications: count(applicationsTable.id),

        offers: sql<number>`
          count(*) filter (
            where ${applicationsTable.status} = 'OFFER'
          )::int
        `,

        rejected: sql<number>`
          count(*) filter (
            where ${applicationsTable.status} = 'REJECTED'
          )::int
        `,
      })
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, userId))
  )[0] ?? {
    totalApplications: 0,
    offers: 0,
    rejected: 0,
  };

  // 2. Total interviews belonging to this user
  const interviewStats = (
    await db
      .select({
        totalInterviews: count(interviewsTable.id),
      })
      .from(interviewsTable)
      .innerJoin(
        applicationsTable,
        eq(
          interviewsTable.applicationId,
          applicationsTable.id,
        ),
      )
      .where(eq(applicationsTable.userId, userId))
  )[0] ?? {
    totalInterviews: 0,
  };

  // 3. Applications grouped by status
  const statusStats = await db
    .select({
      status: applicationsTable.status,
      count: count(applicationsTable.id),
    })
    .from(applicationsTable)
    .where(eq(applicationsTable.userId, userId))
    .groupBy(applicationsTable.status);

  const applicationsByStatus: DashboardResponse["applicationsByStatus"] = {
    SAVED: 0,
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    OFFER: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };

  for (const row of statusStats) {
    applicationsByStatus[row.status] = row.count;
  }

  // 4. Recent applications
  const recentApplications = await db
    .select({
      id: applicationsTable.id,
      jobTitle: applicationsTable.jobTitle,
      status: applicationsTable.status,
      appliedAt: applicationsTable.appliedAt,

      company: {
        id: companiesTable.id,
        name: companiesTable.name,
      },
    })
    .from(applicationsTable)
    .innerJoin(
      companiesTable,
      eq(
        applicationsTable.companyId,
        companiesTable.id,
      ),
    )
    .where(eq(applicationsTable.userId, userId))
    .orderBy(desc(applicationsTable.createdAt))
    .limit(5);

  // 5. Upcoming interviews
  const upcomingInterviews = await db
    .select({
      id: interviewsTable.id,
      round: interviewsTable.round,
      scheduledAt: interviewsTable.scheduledAt,
      status: interviewsTable.status,

      application: {
        id: applicationsTable.id,
        jobTitle: applicationsTable.jobTitle,
      },

      company: {
        id: companiesTable.id,
        name: companiesTable.name,
      },
    })
    .from(interviewsTable)
    .innerJoin(
      applicationsTable,
      eq(
        interviewsTable.applicationId,
        applicationsTable.id,
      ),
    )
    .innerJoin(
      companiesTable,
      eq(
        applicationsTable.companyId,
        companiesTable.id,
      ),
    )
    .where(
      and(
        eq(applicationsTable.userId, userId),
        eq(interviewsTable.status, "SCHEDULED"),
        sql`${interviewsTable.scheduledAt} > NOW()`,
      ),
    )
    .orderBy(interviewsTable.scheduledAt)
    .limit(5);

  return {
    statistics: {
      totalApplications: applicationStats.totalApplications,
      totalInterviews: interviewStats.totalInterviews,
      offers: applicationStats.offers,
      rejected: applicationStats.rejected,
    },

    applicationsByStatus,

    recentApplications,

    upcomingInterviews,
  };
};