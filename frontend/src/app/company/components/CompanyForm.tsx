import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCompanySchema,
  type Company,
  type CreateCompanyPayload,
} from "../company.schema";

import {
  createCompany,
  updateCompany,
} from "../company.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompanyFormProps {
  company?: Company;
  onCreated?: (company: Company) => void;
  onUpdated?: (company: Company) => void;
}

const CompanyForm = ({
  company,
  onCreated,
  onUpdated,
}: CompanyFormProps) => {
  const isEditMode = Boolean(company);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<CreateCompanyPayload>({
    resolver: zodResolver(createCompanySchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: company?.name ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      industry: company?.industry ?? "",
      notes: company?.notes ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: company?.name ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      industry: company?.industry ?? "",
      notes: company?.notes ?? "",
    });
  }, [company, reset]);

  const onSubmit = async (data: CreateCompanyPayload) => {
    if (isEditMode && company) {
      const updatedCompany = await updateCompany(
        company.id,
        data,
      );

      onUpdated?.(updatedCompany);

      reset({
        name: updatedCompany.name,
        website: updatedCompany.website ?? "",
        location: updatedCompany.location ?? "",
        industry: updatedCompany.industry ?? "",
        notes: updatedCompany.notes ?? "",
      });

      return;
    }

    const createdCompany = await createCompany(data);

    onCreated?.(createdCompany);

    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Company" : "Add Company"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Company Name */}
          <div className="space-y-2">
            <label
              htmlFor="company-name"
              className="text-sm font-medium"
            >
              Company Name
            </label>

            <Input
              id="company-name"
              placeholder="e.g. Google"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Website + Location */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="company-website"
                className="text-sm font-medium"
              >
                Website
              </label>

              <Input
                id="company-website"
                placeholder="https://example.com"
                {...register("website")}
              />

              {errors.website && (
                <p className="text-sm text-destructive">
                  {errors.website.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="company-location"
                className="text-sm font-medium"
              >
                Location
              </label>

              <Input
                id="company-location"
                placeholder="e.g. Pune"
                {...register("location")}
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <label
              htmlFor="company-industry"
              className="text-sm font-medium"
            >
              Industry
            </label>

            <Input
              id="company-industry"
              placeholder="e.g. SaaS"
              {...register("industry")}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label
              htmlFor="company-notes"
              className="text-sm font-medium"
            >
              Notes
            </label>

            <Textarea
              id="company-notes"
              placeholder="Add any notes about this company..."
              rows={4}
              {...register("notes")}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (isEditMode && !isDirty)
              }
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Company"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;