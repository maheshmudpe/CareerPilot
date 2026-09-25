import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  applicationFormSchema,
  type Application,
  type ApplicationFormValues,
  type CreateApplicationPayload,
} from "../application.schema";

import {
  createApplication,
  updateApplication,
} from "../application.service";

import type { Company } from "@/app/company/company.schema";

interface ApplicationFormProps {
  companies: Company[];
  application?: Application;
  onCreated?: (application: Application) => void;
  onUpdated?: (application: Application) => void;
}

const ApplicationForm = ({
  companies,
  application,
  onCreated,
  onUpdated,
}: ApplicationFormProps) => {
  const isEditMode = Boolean(application);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",

    defaultValues: {
      companyId: application?.companyId ?? "",
      jobTitle: application?.jobTitle ?? "",
      jobDescription:
        application?.jobDescription ?? "",
      jobUrl: application?.jobUrl ?? "",
      status: application?.status ?? "SAVED",
      appliedAt: application?.appliedAt
        ? application.appliedAt
            .toISOString()
            .split("T")[0]
        : "",
      salary: application?.salary ?? "",
      location: application?.location ?? "",
      employmentType:
        application?.employmentType ?? "",
      notes: application?.notes ?? "",
    },
  });

  useEffect(() => {
    reset({
      companyId: application?.companyId ?? "",
      jobTitle: application?.jobTitle ?? "",
      jobDescription:
        application?.jobDescription ?? "",
      jobUrl: application?.jobUrl ?? "",
      status: application?.status ?? "SAVED",
      appliedAt: application?.appliedAt
        ? application.appliedAt
            .toISOString()
            .split("T")[0]
        : "",
      salary: application?.salary ?? "",
      location: application?.location ?? "",
      employmentType:
        application?.employmentType ?? "",
      notes: application?.notes ?? "",
    });
  }, [application, reset]);

  const onSubmit = async (
    data: ApplicationFormValues
  ) => {
    const payload: CreateApplicationPayload = {
      companyId: data.companyId,
      jobTitle: data.jobTitle,
      jobDescription:
        data.jobDescription || undefined,
      jobUrl:
        data.jobUrl || undefined,
      status: data.status,
      appliedAt: data.appliedAt
        ? new Date(data.appliedAt)
        : undefined,
      salary:
        data.salary || undefined,
      location:
        data.location || undefined,
      employmentType:
        data.employmentType || undefined,
      notes:
        data.notes || undefined,
    };

    if (isEditMode && application) {
      const updatedApplication =
        await updateApplication(
          application.id,
          payload
        );

      onUpdated?.(updatedApplication);

      reset({
        companyId:
          updatedApplication.companyId,
        jobTitle:
          updatedApplication.jobTitle,
        jobDescription:
          updatedApplication.jobDescription ?? "",
        jobUrl:
          updatedApplication.jobUrl ?? "",
        status:
          updatedApplication.status,
        appliedAt:
          updatedApplication.appliedAt
            ? updatedApplication.appliedAt
                .toISOString()
                .split("T")[0]
            : "",
        salary:
          updatedApplication.salary ?? "",
        location:
          updatedApplication.location ?? "",
        employmentType:
          updatedApplication.employmentType ?? "",
        notes:
          updatedApplication.notes ?? "",
      });

      return;
    }

    const createdApplication =
      await createApplication(payload);

    onCreated?.(createdApplication);

    reset({
      companyId: "",
      jobTitle: "",
      jobDescription: "",
      jobUrl: "",
      status: "SAVED",
      appliedAt: "",
      salary: "",
      location: "",
      employmentType: "",
      notes: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Company */}
      <div className="space-y-2">
        <label
          htmlFor="companyId"
          className="text-sm font-medium"
        >
          Company
        </label>

        <select
          id="companyId"
          {...register("companyId")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Select a company
          </option>

          {companies.map((company) => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>
          ))}
        </select>

        {errors.companyId && (
          <p className="text-sm text-destructive">
            {errors.companyId.message}
          </p>
        )}
      </div>

      {/* Job Title */}
      <div className="space-y-2">
        <label
          htmlFor="jobTitle"
          className="text-sm font-medium"
        >
          Job Title
        </label>

        <input
          id="jobTitle"
          type="text"
          placeholder="e.g. Backend Developer"
          {...register("jobTitle")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {errors.jobTitle && (
          <p className="text-sm text-destructive">
            {errors.jobTitle.message}
          </p>
        )}
      </div>

      {/* Job URL */}
      <div className="space-y-2">
        <label
          htmlFor="jobUrl"
          className="text-sm font-medium"
        >
          Job URL
        </label>

        <input
          id="jobUrl"
          type="url"
          placeholder="https://..."
          {...register("jobUrl")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {errors.jobUrl && (
          <p className="text-sm text-destructive">
            {errors.jobUrl.message}
          </p>
        )}
      </div>

      {/* Status + Employment Type */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            {...register("status")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="SAVED">
              Saved
            </option>

            <option value="APPLIED">
              Applied
            </option>

            <option value="SCREENING">
              Screening
            </option>

            <option value="INTERVIEW">
              Interview
            </option>

            <option value="OFFER">
              Offer
            </option>

            <option value="ACCEPTED">
              Accepted
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="WITHDRAWN">
              Withdrawn
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="employmentType"
            className="text-sm font-medium"
          >
            Employment Type
          </label>

          <select
            id="employmentType"
            {...register("employmentType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">
              Select type
            </option>

            <option value="FULL_TIME">
              Full Time
            </option>

            <option value="PART_TIME">
              Part Time
            </option>

            <option value="INTERNSHIP">
              Internship
            </option>

            <option value="CONTRACT">
              Contract
            </option>
          </select>
        </div>
      </div>

      {/* Applied Date + Salary */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="appliedAt"
            className="text-sm font-medium"
          >
            Applied Date
          </label>

          <input
            id="appliedAt"
            type="date"
            {...register("appliedAt")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="salary"
            className="text-sm font-medium"
          >
            Salary
          </label>

          <input
            id="salary"
            type="text"
            placeholder="e.g. ₹6 LPA"
            {...register("salary")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="text-sm font-medium"
        >
          Location
        </label>

        <input
          id="location"
          type="text"
          placeholder="e.g. Pune"
          {...register("location")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label
          htmlFor="jobDescription"
          className="text-sm font-medium"
        >
          Job Description
        </label>

        <textarea
          id="jobDescription"
          rows={5}
          placeholder="Add the job description..."
          {...register("jobDescription")}
          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label
          htmlFor="notes"
          className="text-sm font-medium"
        >
          Notes
        </label>

        <textarea
          id="notes"
          rows={4}
          placeholder="Add notes about this application..."
          {...register("notes")}
          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            (isEditMode && !isDirty)
          }
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Add Application"}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;