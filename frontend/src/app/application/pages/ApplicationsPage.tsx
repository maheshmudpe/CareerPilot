import { useEffect, useState } from "react";

import ApplicationList from "../components/ApplicationList";
import ApplicationForm from "../components/ApplicationForm";

import {
  getApplications,
} from "../application.service";

import type {
  Application,
} from "../application.schema";

import {
  getCompanies,
} from "@/app/company/company.service";

import type {
  Company,
} from "@/app/company/company.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ApplicationsPage = () => {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] =
    useState(false);

  const [isInitialLoading, setIsInitialLoading] =
    useState(true);

  const [isQueryLoading, setIsQueryLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const [sortBy, setSortBy] = useState<
    "createdAt" | "updatedAt" | "appliedAt" | "jobTitle"
  >("createdAt");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  const loadApplications = async (
    searchTerm = "",
    statusFilter = "",
    companyFilter = "",
    sortField: "createdAt" | "updatedAt" | "appliedAt" | "jobTitle" = "createdAt",
    order: "asc" | "desc" = "desc",
    pageNumber = 1
  ) => {
   try {
  setError(null);
  setIsQueryLoading(true);

      const result = await getApplications({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        companyId: companyFilter || undefined,
        sortBy: sortField,
        sortOrder: order,
        page: pageNumber,
        limit: 10,
      });


      setApplications(result.applications);
      setTotalPages(result.pagination.totalPages);
      setTotalApplications(result.pagination.total);
    } catch (error) {
      console.error("Failed to load applications:", error);
      setError("Unable to load applications.");
    }

    finally {
  setIsQueryLoading(false);
}
  };

  const handleApplicationCreated = (
    application: Application
  ) => {
    setApplications((current) => [
      application,
      ...current,
    ]);

    setIsAddDialogOpen(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsInitialLoading(true);
        setError(null);

        const [
          applicationsResult,
          companiesResult,
        ] = await Promise.all([
          getApplications(),
          getCompanies(),
        ]);

        setApplications(
          applicationsResult.applications
        );

        setCompanies(
          companiesResult.companies
        );
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error
        );

        setError(
          "Unable to load applications."
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (isInitialLoading) return;

    loadApplications(
      search,
      status,
      companyId,
      sortBy,
      sortOrder,
      page
    );
  }, [
    search,
    status,
    companyId,
    sortBy,
    sortOrder,
    page,
    isInitialLoading,
  ]);


  useEffect(() => {
    setPage(1);
  }, [search, status, companyId, sortBy, sortOrder]);


  if (isInitialLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading applications...
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
            Applications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage your job applications.
          </p>
        </div>

        {/* Add Application */}
        <Button
          type="button"
          onClick={() =>
            setIsAddDialogOpen(true)
          }
        >
          + Add Application
        </Button>
      </div>

      {/* Add Application Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Add Application
            </DialogTitle>
          </DialogHeader>

          <ApplicationForm
            companies={companies}
            onCreated={
              handleApplicationCreated
            }
          />
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          type="search"
          placeholder="Search applications..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="SAVED">Saved</option>
          <option value="APPLIED">Applied</option>
          <option value="SCREENING">Screening</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>

        <select
          value={companyId}
          onChange={(event) => setCompanyId(event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All companies</option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>


        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(
              event.target.value as
              | "createdAt"
              | "updatedAt"
              | "appliedAt"
              | "jobTitle"
            )
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Last Updated</option>
          <option value="appliedAt">Applied Date</option>
          <option value="jobTitle">Job Title</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(
              event.target.value as "asc" | "desc"
            )
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      {isQueryLoading && (
        <p className="text-sm text-muted-foreground">
          Updating applications...
        </p>
      )}

      {/* Application List */}
     <ApplicationList
        applications={applications}
        companies={companies}
        hasActiveFilters={
          Boolean(search) ||
          Boolean(status) ||
          Boolean(companyId)
        }
      />

      <div className="flex items-center justify-between gap-4 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {totalApplications === 0
            ? "No applications"
            : `Showing page ${page} of ${totalPages} · ${totalApplications} applications`}
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;