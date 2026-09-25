import { Link } from "react-router";

import type { Company } from "../company.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface CompanyCardProps {
  company: Company;
  onDelete: (companyId: string) => void;
}

const CompanyCard = ({
  company,
  onDelete,
}: CompanyCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-2">
          <Link
            to={`/companies/${company.id}`}
            className="block truncate text-base font-semibold hover:underline"
          >
            {company.name}
          </Link>

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {company.industry && (
              <span>{company.industry}</span>
            )}

            {company.industry && company.location && (
              <span>·</span>
            )}

            {company.location && (
              <span>{company.location}</span>
            )}
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm text-muted-foreground hover:underline"
            >
              {company.website}
            </a>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            to={`/companies/${company.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(company.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;