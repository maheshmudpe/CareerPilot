import ApplicationCard from "./ApplicationCard";
import type { Application } from "../application.schema";
import type { Company } from "@/app/company/company.schema";

interface ApplicationListProps {
  applications: Application[];
  companies: Company[];
}

const ApplicationList = ({
  applications,
  companies,
}: ApplicationListProps) => {
  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">
          No applications found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Add your first application to start tracking your
          job search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const company = companies.find(
          (item) => item.id === application.companyId
        );

        return (
          <ApplicationCard
            key={application.id}
            application={application}
            company={company}
          />
        );
      })}
    </div>
  );
};

export default ApplicationList;