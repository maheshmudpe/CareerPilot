import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import {
  deleteInterview,
  getInterview,
} from "../interview.service";

import type { Interview } from "../interview.schema";

import InterviewForm from "../components/InterviewForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const InterviewDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [interview, setInterview] =
    useState<Interview | null>(null);

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


  /* -------------------------------------------------- */
  /* Delete Interview */
  /* -------------------------------------------------- */

  const handleDeleteInterview = async () => {
    if (!interview) return;

    try {
      setIsDeleting(true);

      await deleteInterview(interview.id);

      setIsDeleteDialogOpen(false);

      navigate("/interviews");
    } catch (error) {
      console.error(
        "Failed to delete interview:",
        error
      );

      setError(
        "Unable to delete interview."
      );
    } finally {
      setIsDeleting(false);
    }
  };


  /* -------------------------------------------------- */
  /* Load Interview */
  /* -------------------------------------------------- */

  useEffect(() => {
    const loadInterview = async () => {
      if (!id) {
        setError(
          "Interview ID is missing."
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);

        setError(null);

        const interviewData =
          await getInterview(id);

        setInterview(interviewData);
      } catch (error) {
        console.error(
          "Failed to load interview:",
          error
        );

        setError(
          "Unable to load interview."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInterview();
  }, [id]);


  /* -------------------------------------------------- */
  /* Loading State */
  /* -------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading interview...
      </div>
    );
  }


  /* -------------------------------------------------- */
  /* Error State */
  /* -------------------------------------------------- */

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }


  /* -------------------------------------------------- */
  /* Empty State */
  /* -------------------------------------------------- */

  if (!interview) {
    return null;
  }


  /* -------------------------------------------------- */
  /* Page */
  /* -------------------------------------------------- */

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <Link
          to="/interviews"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to interviews
        </Link>


        <div className="mt-3 flex items-start justify-between gap-4">

          <div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {interview.round}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Interview details and information.
            </p>

          </div>


          {/* Actions */}

          <div className="flex shrink-0 items-center gap-2">

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


            <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
              {interview.status}
            </span>

          </div>

        </div>

      </div>


      {/* Edit Interview Dialog */}

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              Edit Interview
            </DialogTitle>

          </DialogHeader>


          <InterviewForm
            applications={[]}
            interview={interview}
            onUpdated={(updatedInterview) => {

              setInterview(
                updatedInterview
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
              Delete Interview
            </DialogTitle>


            <DialogDescription>
              Are you sure you want to delete this
              interview? This action cannot be undone.
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
              onClick={handleDeleteInterview}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete Interview"}
            </Button>

          </div>

        </DialogContent>

      </Dialog>


      {/* Interview Information */}

      <div className="rounded-lg border bg-card p-6">

        <h2 className="text-lg font-semibold">
          Interview Information
        </h2>


        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Round */}

          <div>

            <p className="text-sm text-muted-foreground">
              Interview Round
            </p>

            <p className="mt-1 font-medium">
              {interview.round}
            </p>

          </div>


          {/* Scheduled At */}

          <div>

            <p className="text-sm text-muted-foreground">
              Scheduled At
            </p>

            <p className="mt-1 font-medium">
              {interview.scheduledAt
                ? interview.scheduledAt.toLocaleString()
                : "—"}
            </p>

          </div>


          {/* Interviewer */}

          <div>

            <p className="text-sm text-muted-foreground">
              Interviewer
            </p>

            <p className="mt-1 font-medium">
              {interview.interviewer ?? "—"}
            </p>

          </div>


          {/* Meeting URL */}

          <div>

            <p className="text-sm text-muted-foreground">
              Meeting URL
            </p>


            {interview.meetingUrl ? (

              <a
                href={interview.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate font-medium hover:underline"
              >
                {interview.meetingUrl}
              </a>

            ) : (

              <p className="mt-1 font-medium">
                —
              </p>

            )}

          </div>


          {/* Notes */}

          <div className="md:col-span-2">

            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm">
              {interview.notes ?? "—"}
            </p>

          </div>


          {/* Feedback */}

          <div className="md:col-span-2">

            <p className="text-sm text-muted-foreground">
              Feedback
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm">
              {interview.feedback ?? "—"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InterviewDetailsPage;