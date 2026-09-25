import api from "@/services/api";

import {
  filesResponseSchema,
  uploadFileResponseSchema,
  type UploadedFile,
} from "./file.schema";

export const getFiles = async (): Promise<UploadedFile[]> => {
  const response = await api.get("/files");

  const result = filesResponseSchema.parse(response.data);

  return result.files;
};

export const uploadResume = async (
  file: File,
): Promise<UploadedFile> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileType", "RESUME");

  const response = await api.post("/files", formData);

  const result = uploadFileResponseSchema.parse(response.data);

  return result.file;
};