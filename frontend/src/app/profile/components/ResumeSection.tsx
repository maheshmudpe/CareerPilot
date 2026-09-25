import { useEffect, useRef, useState } from "react";

import {
  getFiles,
  uploadResume,
} from "@/app/file/file.service";

import type { UploadedFile } from "@/app/file/file.schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResumeSection = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

            <span className="text-sm text-muted-foreground">
              Uploaded
            </span>
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