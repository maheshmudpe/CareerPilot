import { useEffect, useState } from "react";

import InterviewList from "../components/InterviewList";
import InterviewCard from "../components/InterviewCard";
import InterviewForm from "../components/InterviewForm";

import {
  getInterviews,
  getUpcomingInterviews,
} from "../interview.service";

import type { Interview } from "../interview.schema";

import {
  getApplications,
} from "@/app/application/application.service";

import type {
  Application,
} from "@/app/application/application.schema";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InterviewsPage = () => {
  const [interviews, setInterviews] =
    useState<Interview[]>([]);

  const [upcomingInterviews, setUpcomingInterviews] =
    useState<Interview[]>([]);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] =
    useState(false);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setIsLoading(true);

        setError(null);

        const [
          interviewsResult,
          upcomingInterviewsResult,
          applicationsResult,
        ] = await Promise.all([
          getInterviews({
            sortBy: "scheduledAt",
            sortOrder: "asc",
          }),

          getUpcomingInterviews(),

          getApplications(),
        ]);

        setInterviews(
          interviewsResult
        );

        setUpcomingInterviews(
          upcomingInterviewsResult
        );

        setApplications(
          applicationsResult.applications
        );
      } catch (error) {
        console.error(
          "Failed to load interviews:",
          error
        );

        setError(
          "Unable to load interviews."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading interviews...
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

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Interviews
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Schedule and manage your job interviews.
          </p>

        </div>


        <Button
          type="button"
          onClick={() =>
            setIsScheduleDialogOpen(true)
          }
        >
          + Schedule Interview
        </Button>

      </div>


      {/* Schedule Interview Dialog */}

      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={
          setIsScheduleDialogOpen
        }
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              Schedule Interview
            </DialogTitle>

          </DialogHeader>


          <InterviewForm
            applications={applications}
            onCreated={(createdInterview) => {

              setInterviews(
                (current) => [
                  createdInterview,
                  ...current,
                ]
              );

              setUpcomingInterviews(
                (current) => {

                  if (
                    createdInterview.scheduledAt &&
                    createdInterview.scheduledAt > new Date() &&
                    createdInterview.status !== "CANCELLED" &&
                    createdInterview.status !== "COMPLETED"
                  ) {
                    return [
                      createdInterview,
                      ...current,
                    ];
                  }

                  return current;
                }
              );

              setIsScheduleDialogOpen(false);
            }}
          />

        </DialogContent>

      </Dialog>

      {/* Upcoming Interviews */}

      <section className="space-y-4">

        <div>
          <h2 className="text-lg font-semibold">
            Upcoming Interviews
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your next scheduled interviews.
          </p>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm font-medium">
              No upcoming interviews
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your upcoming interviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => {
              const application =
                applications.find(
                  (item) =>
                    item.id === interview.applicationId
                );

              return (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  applicationTitle={
                    application?.jobTitle
                  }
                />
              );
            })}
          </div>
        )}
      </section>


      {/* Interview List */}

      {/* All Interviews */}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            All Interviews
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all your interviews.
          </p>
        </div>

        <InterviewList
          interviews={interviews}
          applications={applications}
        />
      </section>

    </div>
  );
};

export default InterviewsPage;