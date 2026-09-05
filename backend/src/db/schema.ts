import { pgTable , uuid, varchar , text, timestamp , bigint} from "drizzle-orm/pg-core";
import { primaryKey , unique } from "drizzle-orm/pg-core";

import { pgEnum , index } from "drizzle-orm/pg-core";

// 1. Application Status Enum
export const applicationStatusEnum = pgEnum("application_status", [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
]);

// 2. Employment Type Enum
export const employmentTypeEnum = pgEnum("employment_type", [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
]);

//3. interviewStatuSchema
export const interviewStatusEnum = pgEnum("interview_status", [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
]);

//4. FileCategorySchema
export const fileCategoryEnum = pgEnum("file_category", [
  "RESUME",
  "COVER_LETTER",
  "PORTFOLIO",
  "TRANSCRIPT",
  "CERTIFICATE",
  "OTHER",
]);

export const usersTable = pgTable("users", {

    id:uuid('id').primaryKey().defaultRandom(),
    email: varchar('email' , { length:322 } ).notNull().unique(),
    passwordHash: text("password_hash"),

    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),


})



export const profilesTable = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
        .references(() => usersTable.id , { onDelete: "cascade" })
        .notNull()
        .unique(),

    fullName: varchar("full_name").notNull(),
    phone: varchar("phone"),
    location: varchar("location"),
    bio: text("bio"),
    linkedinUrl: varchar("linkedin_url"),
    githubUrl: varchar("github_url"),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});


export const skillsTable = pgTable("skills" , {

    id:uuid('id').primaryKey().defaultRandom(),
    name:varchar('name' , {length: 45}).notNull().unique(),


    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),


})



export const userSkillsTable = pgTable("user_skills" , {

    userId:uuid('user_id')

        .references(() => usersTable.id , { onDelete: "cascade" })
        .notNull(),


    skillId:uuid('skill_id')
         .references(() => skillsTable.id , { onDelete: "cascade" })
         .notNull(),


},

   (table) => [
        primaryKey({
            columns: [table.userId, table.skillId],
        }),
    ]

);


export const companiesTable = pgTable("companies" , {

    id:uuid('id').primaryKey().defaultRandom(),

    userId:uuid('user_id')

       .references(() => usersTable.id , { onDelete: "cascade" })
       .notNull(),

    name:varchar('name' , {length: 66}).notNull(),
    website:varchar('website'),
    location:varchar('location'),
    industry:varchar('industry'),
    notes:text('notes'),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),

    },

       (table) => [
        unique().on(table.userId, table.name),
    ]
)


export const applicationsTable = pgTable('applications' , {


    id:uuid('id').primaryKey().defaultRandom(),
    userId:uuid('user_id')

        .references(() => usersTable.id , { onDelete: "cascade" })
        .notNull(),


    companyId:uuid('company_id')
        
        .references(() => companiesTable.id, { onDelete: "cascade" })
        .notNull(),


    jobTitle:varchar('job_title').notNull(),
    jobDescription:text('job_description'),
    jobUrl:varchar('job_url'),
    status:applicationStatusEnum('status').notNull(),


    appliedAt:timestamp('applied_at'),
    salary:varchar('salary'),
    location:varchar('location'),
    
    employmentType:employmentTypeEnum('employment_type'),
    notes:text('notes'),


    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),

},

  (table) => [
        index("applications_user_id_idx").on(table.userId),
        index("applications_company_id_idx").on(table.companyId),
        index("applications_status_idx").on(table.status),
    ]


)


export const interviewsTable = pgTable('interviews' , {


    id:uuid('id').primaryKey().defaultRandom(),
    applicationId:uuid('application_id')

                 .references(() => applicationsTable.id , { onDelete: "cascade" })
                 .notNull(),


    round:varchar('round').notNull(),


    scheduledAt:timestamp('scheduled_at'),

    status:interviewStatusEnum('status').notNull(),
    interviewer:varchar('interviewer'),
    meetingUrl:varchar('meeting_url'),
    notes:text('notes'),
    feedback:text('feedback'),


    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),


},

(table) => [
    index("interviews_application_id_idx").on(table.applicationId),
    index("interviews_scheduled_at_idx").on(table.scheduledAt),
]

)


export const filesTable = pgTable('files' , {

    id:uuid('id').primaryKey().defaultRandom(),

    userId:uuid('user_id')

         .references(() => usersTable.id , { onDelete: "cascade" })
         .notNull(),


    applicationId:uuid('application_id')

         .references(() => applicationsTable.id , { onDelete: "set null" }),
      


    fileName:varchar('file_name').notNull(),
    storageKey:varchar('storage_key').notNull(),

    mimeType:varchar('mime_type').notNull(),

    fileSize: bigint("file_size", { mode: "number" }).notNull(),

    fileType:fileCategoryEnum('file_type').notNull(),


    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

},

(table) => [
    index("files_user_id_idx").on(table.userId),
    index("files_application_id_idx").on(table.applicationId)
]




)

