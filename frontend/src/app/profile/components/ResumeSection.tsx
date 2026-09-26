import { useEffect, useRef, useState } from "react";

import {
  getFiles,
  uploadResume,
  deleteFile,
  getFileUrl,
} from "@/app/file/file.service";

import type { UploadedFile } from "@/app/file/file.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ResumeSection = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [resume, setResume] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const files = await getFiles();

        const existingResume = files
          .filter((file) => file.fileType === "RESUME")
          .sort(
            (a, b) =>
              b.createdAt.getTime() - a.createdAt.getTime(),
          )[0];

        setResume(existingResume ?? null);
      } catch (error) {
        console.error("Failed to load resume:", error);
        setError("Unable to load resume.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be 5 MB or less.");

      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const uploadedFile = await uploadResume(file);

      setResume(uploadedFile);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload resume:", error);
      setError("Unable to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleDeleteResume = async () => {
    if (!resume) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      await deleteFile(resume.id);

      setResume(null);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setError("Unable to delete resume.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewResume = async () => {
    if (!resume) {
      return;
    }

    try {
      setError(null);

      const url = await getFileUrl(resume.id);

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open resume:", error);
      setError("Unable to open resume.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
  {isLoading ? (
    <p className="text-sm text-muted-foreground">
      Loading resume...
    </p>
  ) : resume ? (
    <div className="flex items-center justify-between rounded-md border p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {resume.fileName}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {resume.mimeType === "application/pdf"
            ? "PDF"
            : "DOCX"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewResume}
        >
          View
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDeleteResume}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Upload your resume in PDF or DOCX format.
    </p>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    onChange={handleFileChange}
    className="hidden"
  />

  <Button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    disabled={isUploading}
  >
    {isUploading ? "Uploading..." : "Upload Resume"}
  </Button>

  {error && (
    <p className="text-sm text-destructive">
      {error}
    </p>
  )}
</CardContent>
    </Card>
  );
};

export default ResumeSection;