import type { Application } from "../application.schema";
import type { Company } from "@/app/company/company.schema";
import { Link } from "react-router";

interface ApplicationCardProps {
  application: Application;
  company?: Company;
}

const ApplicationCard = ({
  application,
  company,
}: ApplicationCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
         <Link
            to={`/applications/${application.id}`}
            className="block truncate text-base font-semibold hover:underline"
            >
            {application.jobTitle}
        </Link>

          {company && (
            <p className="text-sm text-muted-foreground">
              {company.name}
            </p>
          )}

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {application.location && (
              <span>{application.location}</span>
            )}

            {application.location &&
              application.employmentType && (
                <span>·</span>
              )}

            {application.employmentType && (
              <span>
                {application.employmentType}
              </span>
            )}
          </div>
        </div>

        <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium">
          {application.status}
        </span>
      </div>
    </div>
  );
};

export default ApplicationCard;