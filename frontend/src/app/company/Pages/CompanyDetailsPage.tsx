import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import CompanyForm from "../components/CompanyForm";
import { getCompany } from "../company.service";
import type { Company } from "../company.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      if (!id) {
        setError("Company ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await getCompany(id);

        setCompany(data);
      } catch (error) {
        console.error("Failed to load company:", error);

        setError("Unable to load company.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading company...
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

  if (!company) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/companies"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to companies
          </Link>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {company.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Company details and information.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsEditDialogOpen(true)}
        >
          Edit
        </Button>
      </div>

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Company Name
            </p>

            <p className="mt-1 font-medium">
              {company.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Industry
            </p>

            <p className="mt-1 font-medium">
              {company.industry || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Location
            </p>

            <p className="mt-1 font-medium">
              {company.location || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Website
            </p>

            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block font-medium hover:underline"
              >
                {company.website}
              </a>
            ) : (
              <p className="mt-1 font-medium">
                Not specified
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Notes
            </p>

            <p className="mt-1 whitespace-pre-wrap font-medium">
              {company.notes || "No notes added."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          <CompanyForm
            company={company}
            onUpdated={(updatedCompany) => {
              setCompany(updatedCompany);
              setIsEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetailsPage;