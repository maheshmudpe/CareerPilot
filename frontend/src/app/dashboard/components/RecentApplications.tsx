import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecentApplication {
  id: string;
  jobTitle: string;
  status:
    | "SAVED"
    | "APPLIED"
    | "SCREENING"
    | "INTERVIEW"
    | "OFFER"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
  appliedAt: Date | null;
  company: {
    id: string;
    name: string;
  };
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

const RecentApplications = ({
  applications,
}: RecentApplicationsProps) => {
  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Recent Applications</CardTitle>

    <Link
        to="/applications"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
        View all →
    </Link>
    </CardHeader>

      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BriefcaseBusiness className="mb-3 h-8 w-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              No applications yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your recent job applications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {application.jobTitle}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {application.company.name}
                  </p>
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-4">
                  <span className="text-sm font-medium">
                    {application.status}
                  </span>

                  <span className="hidden text-sm text-muted-foreground sm:block">
                   {application.appliedAt
                    ? new Date(
                        application.appliedAt,
                        ).toLocaleDateString()
                    : "Date not recorded"}
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

export default RecentApplications;