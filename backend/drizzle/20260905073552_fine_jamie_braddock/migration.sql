CREATE TYPE "application_status" AS ENUM('SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "employment_type" AS ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT');--> statement-breakpoint
CREATE TYPE "file_category" AS ENUM('RESUME', 'COVER_LETTER', 'PORTFOLIO', 'TRANSCRIPT', 'CERTIFICATE', 'OTHER');--> statement-breakpoint
CREATE TYPE "interview_status" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"job_title" varchar NOT NULL,
	"job_description" text,
	"job_url" varchar,
	"status" "application_status" NOT NULL,
	"applied_at" timestamp,
	"salary" varchar,
	"location" varchar,
	"employment_type" "employment_type",
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" varchar(66) NOT NULL,
	"website" varchar,
	"location" varchar,
	"industry" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"file_name" varchar NOT NULL,
	"storage_key" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"file_size" bigint NOT NULL,
	"file_type" "file_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"application_id" uuid NOT NULL,
	"round" varchar NOT NULL,
	"scheduled_at" timestamp,
	"status" "interview_status" NOT NULL,
	"interviewer" varchar,
	"meeting_url" varchar,
	"notes" text,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL UNIQUE,
	"full_name" varchar NOT NULL,
	"phone" varchar,
	"location" varchar,
	"bio" text,
	"linkedin_url" varchar,
	"github_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(45) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_skills" (
	"user_id" uuid,
	"skill_id" uuid,
	CONSTRAINT "user_skills_pkey" PRIMARY KEY("user_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(322) NOT NULL UNIQUE,
	"password_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "applications" ("user_id");--> statement-breakpoint
CREATE INDEX "applications_company_id_idx" ON "applications" ("company_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" ("status");--> statement-breakpoint
CREATE INDEX "files_user_id_idx" ON "files" ("user_id");--> statement-breakpoint
CREATE INDEX "files_application_id_idx" ON "files" ("application_id");--> statement-breakpoint
CREATE INDEX "interviews_application_id_idx" ON "interviews" ("application_id");--> statement-breakpoint
CREATE INDEX "interviews_scheduled_at_idx" ON "interviews" ("scheduled_at");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_skills_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE;