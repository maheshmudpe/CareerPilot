import { Link } from "react-router";

import type { Interview } from "../interview.schema";

interface InterviewCardProps {
  interview: Interview;
  applicationTitle?: string;
}

const InterviewCard = ({
  interview,
  applicationTitle,
}: InterviewCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Link
            to={`/interviews/${interview.id}`}
            className="block truncate text-base font-semibold hover:underline"
          >
            {interview.round}
          </Link>

          {applicationTitle && (
            <p className="text-sm text-muted-foreground">
              {applicationTitle}
            </p>
          )}

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {interview.scheduledAt && (
              <span>
                {interview.scheduledAt.toLocaleString()}
              </span>
            )}

            {interview.scheduledAt &&
              interview.interviewer && (
                <span>·</span>
              )}

            {interview.interviewer && (
              <span>
                {interview.interviewer}
              </span>
            )}
          </div>
        </div>

        <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium">
          {interview.status}
        </span>
      </div>
    </div>
  );
};

export default InterviewCard;