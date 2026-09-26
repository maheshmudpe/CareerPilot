import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
  interviewFormSchema,
  type Interview,
  type InterviewFormValues,
  type CreateInterviewPayload,
  type UpdateInterviewPayload,
} from "../interview.schema";

import {
  createInterview,
  updateInterview,
} from "../interview.service";

import type { Application } from "@/app/application/application.schema";

interface InterviewFormProps {
  applications: Application[];

  interview?: Interview;

  onCreated?: (interview: Interview) => void;

  onUpdated?: (interview: Interview) => void;
}

const InterviewForm = ({
  applications,
  interview,
  onCreated,
  onUpdated,
}: InterviewFormProps) => {
  const isEditMode = Boolean(interview);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),

    mode: "onSubmit",

    reValidateMode: "onChange",

    defaultValues: {
      applicationId:
        interview?.applicationId ?? "",

      round:
        interview?.round ?? "",

      scheduledAt:
        interview?.scheduledAt
          ? interview.scheduledAt
              .toISOString()
              .slice(0, 16)
          : "",

      status:
        interview?.status ?? "SCHEDULED",

      interviewer:
        interview?.interviewer ?? "",

      meetingUrl:
        interview?.meetingUrl ?? "",

      notes:
        interview?.notes ?? "",

      feedback:
        interview?.feedback ?? "",
    },
  });

  useEffect(() => {
    reset({
      applicationId:
        interview?.applicationId ?? "",

      round:
        interview?.round ?? "",

      scheduledAt:
        interview?.scheduledAt
          ? interview.scheduledAt
              .toISOString()
              .slice(0, 16)
          : "",

      status:
        interview?.status ?? "SCHEDULED",

      interviewer:
        interview?.interviewer ?? "",

      meetingUrl:
        interview?.meetingUrl ?? "",

      notes:
        interview?.notes ?? "",

      feedback:
        interview?.feedback ?? "",
    });
  }, [interview, reset]);

  const onSubmit = async (
    data: InterviewFormValues
  ) => {
    if (isEditMode && interview) {
      const payload: UpdateInterviewPayload = {
        round: data.round,

        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt)
          : undefined,

        status: data.status,

        interviewer:
          data.interviewer || undefined,

        meetingUrl:
          data.meetingUrl || undefined,

        notes:
          data.notes || undefined,

        feedback:
          data.feedback || undefined,
      };

      const updatedInterview =
        await updateInterview(
          interview.id,
          payload
        );

      onUpdated?.(updatedInterview);

      reset({
        applicationId:
          updatedInterview.applicationId,

        round:
          updatedInterview.round,

        scheduledAt:
          updatedInterview.scheduledAt
            ? updatedInterview.scheduledAt
                .toISOString()
                .slice(0, 16)
            : "",

        status:
          updatedInterview.status,

        interviewer:
          updatedInterview.interviewer ?? "",

        meetingUrl:
          updatedInterview.meetingUrl ?? "",

        notes:
          updatedInterview.notes ?? "",

        feedback:
          updatedInterview.feedback ?? "",
      });

      return;
    }

    const payload: CreateInterviewPayload = {
      applicationId:
        data.applicationId,

      round:
        data.round,

      scheduledAt:
        data.scheduledAt
          ? new Date(data.scheduledAt)
          : undefined,

      status:
        data.status,

      interviewer:
        data.interviewer || undefined,

      meetingUrl:
        data.meetingUrl || undefined,

      notes:
        data.notes || undefined,
    };

    const createdInterview =
      await createInterview(payload);

    onCreated?.(createdInterview);

    reset({
      applicationId: "",
      round: "",
      scheduledAt: "",
      status: "SCHEDULED",
      interviewer: "",
      meetingUrl: "",
      notes: "",
      feedback: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Application */}
      <div className="space-y-2">
        <label
          htmlFor="applicationId"
          className="text-sm font-medium"
        >
          Application
        </label>

        <select
          id="applicationId"
          {...register("applicationId")}
          disabled={isEditMode}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            Select an application
          </option>

          {applications.map((application) => (
            <option
              key={application.id}
              value={application.id}
            >
              {application.jobTitle}
            </option>
          ))}
        </select>

        {errors.applicationId && (
          <p className="text-sm text-destructive">
            {errors.applicationId.message}
          </p>
        )}
      </div>

      {/* Interview Round */}
      <div className="space-y-2">
        <label
          htmlFor="round"
          className="text-sm font-medium"
        >
          Interview Round
        </label>

        <input
          id="round"
          type="text"
          placeholder="e.g. Technical Interview"
          {...register("round")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {errors.round && (
          <p className="text-sm text-destructive">
            {errors.round.message}
          </p>
        )}
      </div>

      {/* Date and Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scheduled At */}
        <div className="space-y-2">
          <label
            htmlFor="scheduledAt"
            className="text-sm font-medium"
          >
            Scheduled At
          </label>

          <input
            id="scheduledAt"
            type="datetime-local"
            {...register("scheduledAt")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />

          {errors.scheduledAt && (
            <p className="text-sm text-destructive">
              {errors.scheduledAt.message}
            </p>
          )}
        </div>

        {/* Status */}
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
            <option value="SCHEDULED">
              Scheduled
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="RESCHEDULED">
              Rescheduled
            </option>
          </select>

          {errors.status && (
            <p className="text-sm text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      {/* Interviewer */}
      <div className="space-y-2">
        <label
          htmlFor="interviewer"
          className="text-sm font-medium"
        >
          Interviewer
        </label>

        <input
          id="interviewer"
          type="text"
          placeholder="e.g. John Smith"
          {...register("interviewer")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Meeting URL */}
      <div className="space-y-2">
        <label
          htmlFor="meetingUrl"
          className="text-sm font-medium"
        >
          Meeting URL
        </label>

        <input
          id="meetingUrl"
          type="url"
          placeholder="https://meet.google.com/..."
          {...register("meetingUrl")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {errors.meetingUrl && (
          <p className="text-sm text-destructive">
            {errors.meetingUrl.message}
          </p>
        )}
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
          placeholder="Add notes about the interview..."
          {...register("notes")}
          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Feedback */}
      {isEditMode && (
        <div className="space-y-2">
          <label
            htmlFor="feedback"
            className="text-sm font-medium"
          >
            Feedback
          </label>

          <textarea
            id="feedback"
            rows={4}
            placeholder="Add feedback after the interview..."
            {...register("feedback")}
            className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      {/* Submit */}
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
              : "Scheduling..."
            : isEditMode
              ? "Save Changes"
              : "Schedule Interview"}
        </button>
      </div>
    </form>
  );
};

export default InterviewForm;