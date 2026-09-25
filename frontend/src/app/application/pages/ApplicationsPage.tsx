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

  const [isAddDialogOpen, setIsAddDialogOpen] =
    useState(false);

  const [isInitialLoading, setIsInitialLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadApplications = async (
    searchTerm = ""
  ) => {
    try {
      setError(null);

      const result = await getApplications({
        search: searchTerm || undefined,
      });

      setApplications(result.applications);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );

      setError(
        "Unable to load applications."
      );
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

    loadApplications(search);
  }, [search, isInitialLoading]);

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
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Search applications..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {/* Application List */}
      <ApplicationList
        applications={applications}
        companies={companies}
      />
    </div>
  );
};

export default ApplicationsPage;