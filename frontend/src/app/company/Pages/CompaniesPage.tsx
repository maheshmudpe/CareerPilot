import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CompanyForm from "../components/CompanyForm";
import CompanyList from "../components/CompanyList";
import {
  deleteCompany,
  getCompanies,
} from "../company.service";
import type { Company } from "../company.schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [companyToDelete, setCompanyToDelete] =
    useState<Company | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

const loadCompanies = async (searchTerm = "") => {
  try {
    setError(null);

    const result = await getCompanies({
      search: searchTerm || undefined,
    });

    setCompanies(result.companies);
  } catch (error) {
    console.error("Failed to load companies:", error);
    setError("Unable to load companies.");
  }
};

useEffect(() => {
  const loadInitialCompanies = async () => {
    try {
      setIsInitialLoading(true);
      setError(null);

      const result = await getCompanies();

      setCompanies(result.companies);
    } catch (error) {
      console.error("Failed to load companies:", error);
      setError("Unable to load companies.");
    } finally {
      setIsInitialLoading(false);
    }
  };

  loadInitialCompanies();
}, []);

useEffect(() => {
  if (isInitialLoading) return;

  loadCompanies(search);
}, [search, isInitialLoading]);

  const handleCompanyCreated = (company: Company) => {
    setCompanies((current) => [company, ...current]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete.id);

      setCompanies((current) =>
        current.filter(
          (company) => company.id !== companyToDelete.id
        )
      );

      setCompanyToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading companies...
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
            Companies
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the companies you're applying to.
          </p>
        </div>

        {/* Add Company */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger>
            <Button type="button">
              + Add Company
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Add Company
              </DialogTitle>
            </DialogHeader>

            <CompanyForm
              onCreated={handleCompanyCreated}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-md">
      <Input
        type="search"
        placeholder="Search companies..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
     </div>

      {/* Company List */}
      <CompanyList
        companies={companies}
        onDelete={(companyId) => {
          const company = companies.find(
            (item) => item.id === companyId
          );

          if (!company) return;

          setCompanyToDelete(company);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Company
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {companyToDelete?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setIsDeleteDialogOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteCompany}
            >
              Delete Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesPage;