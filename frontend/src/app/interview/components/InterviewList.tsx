import InterviewCard from "./InterviewCard";

import type { Interview } from "../interview.schema";

import type { Application } from "@/app/application/application.schema";

interface InterviewListProps {
  interviews: Interview[];
  applications: Application[];
}

const InterviewList = ({
  interviews,
  applications,
}: InterviewListProps) => {
  if (interviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">
          No interviews found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Schedule your first interview to start
          tracking your interview process.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => {
        const application = applications.find(
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
  );
};

export default InterviewList;