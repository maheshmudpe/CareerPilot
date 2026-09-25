import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "../application.service";

import ApplicationForm from "../components/ApplicationForm";

import type { Application } from "../application.schema";

import { getCompanies } from "@/app/company/company.service";
import type { Company } from "@/app/company/company.schema";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ApplicationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDeleteApplication = async () => {
    if (!application) return;

    try {
      setIsDeleting(true);

      await deleteApplication(application.id);

      setIsDeleteDialogOpen(false);

      navigate("/applications");
    } catch (error) {
      console.error(
        "Failed to delete application:",
        error
      );

      setError(
        "Unable to delete application."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    newStatus: Application["status"]
  ) => {
    if (!application) return;

    try {
      const updatedApplication =
        await updateApplication(
          application.id,
          {
            status: newStatus,
          }
        );

      setApplication(updatedApplication);
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      setError(
        "Unable to update application status."
      );
    }
  };

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) {
        setError(
          "Application ID is missing."
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [
          applicationData,
          companiesResult,
        ] = await Promise.all([
          getApplication(id),
          getCompanies(),
        ]);

        setApplication(applicationData);

        setCompanies(
          companiesResult.companies
        );
      } catch (error) {
        console.error(
          "Failed to load application:",
          error
        );

        setError(
          "Unable to load application."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading application...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/applications"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to applications
          </Link>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {application.jobTitle}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Application details and information.
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            onClick={() =>
              setIsEditDialogOpen(true)
            }
          >
            Edit
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              setIsDeleteDialogOpen(true)
            }
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Application Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Application
            </DialogTitle>
          </DialogHeader>

          <ApplicationForm
            companies={companies}
            application={application}
            onUpdated={(updatedApplication) => {
              setApplication(
                updatedApplication
              );

              setIsEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Application
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {application.jobTitle}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() =>
                setIsDeleteDialogOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteApplication}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete Application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            Application Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Status */}
          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <select
              value={application.status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as Application["status"]
                )
              }
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
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

          {/* Employment Type */}
          <div>
            <p className="text-sm text-muted-foreground">
              Employment Type
            </p>

            <p className="mt-1 font-medium">
              {application.employmentType ?? "—"}
            </p>
          </div>

          {/* Location */}
          <div>
            <p className="text-sm text-muted-foreground">
              Location
            </p>

            <p className="mt-1 font-medium">
              {application.location ?? "—"}
            </p>
          </div>

          {/* Salary */}
          <div>
            <p className="text-sm text-muted-foreground">
              Salary
            </p>

            <p className="mt-1 font-medium">
              {application.salary ?? "—"}
            </p>
          </div>

          {/* Applied At */}
          <div>
            <p className="text-sm text-muted-foreground">
              Applied At
            </p>

            <p className="mt-1 font-medium">
              {application.appliedAt
                ? application.appliedAt.toLocaleDateString()
                : "—"}
            </p>
          </div>

          {/* Job URL */}
          <div>
            <p className="text-sm text-muted-foreground">
              Job URL
            </p>

            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate font-medium hover:underline"
              >
                {application.jobUrl}
              </a>
            ) : (
              <p className="mt-1 font-medium">
                —
              </p>
            )}
          </div>

          {/* Job Description */}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Job Description
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm">
              {application.jobDescription ??
                "—"}
            </p>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm">
              {application.notes ?? "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailsPage;