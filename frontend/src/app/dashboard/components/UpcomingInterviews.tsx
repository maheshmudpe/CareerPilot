import { CalendarDays, Clock } from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UpcomingInterview {
  id: string;
  round: string;
  scheduledAt: Date | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  application: {
    id: string;
    jobTitle: string;
  };
  company: {
    id: string;
    name: string;
  };
}

interface UpcomingInterviewsProps {
  interviews: UpcomingInterview[];
}

const UpcomingInterviews = ({
  interviews,
}: UpcomingInterviewsProps) => {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Interviews</CardTitle>

        <Link
            to="/interviews"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
            View all →
        </Link>
    </CardHeader>

      <CardContent>
        {interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="mb-3 h-8 w-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              No upcoming interviews
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Scheduled interviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {interview.application.jobTitle}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {interview.company.name}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {interview.round}
                  </p>
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />

                  <span>
                    {interview.scheduledAt
                      ? new Date(
                          interview.scheduledAt,
                        ).toLocaleString()
                      : "Date not scheduled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;