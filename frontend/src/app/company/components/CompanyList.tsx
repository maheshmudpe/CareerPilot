import CompanyCard from "./CompanyCard";
import type { Company } from "../company.schema";

interface CompanyListProps {
  companies: Company[];
  onDelete: (companyId: string) => void;
}

const CompanyList = ({
  companies,
  onDelete,
}: CompanyListProps) => {
  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-sm font-medium">
          No companies found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Add your first company to start tracking applications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CompanyList;