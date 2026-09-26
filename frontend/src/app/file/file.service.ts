import api from "@/services/api";

import {
  filesResponseSchema,
  uploadFileResponseSchema,
  type UploadedFile,
} from "./file.schema";

/* -------------------------------------------------- */
/* Get Files */
/* -------------------------------------------------- */

export const getFiles = async (): Promise<UploadedFile[]> => {
  const response = await api.get("/files");

  const result = filesResponseSchema.parse(response.data);

  return result.files;
};

/* -------------------------------------------------- */
/* Upload Resume */
/* -------------------------------------------------- */

export const uploadResume = async (
  file: File
): Promise<UploadedFile> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileType", "RESUME");

  const response = await api.post("/files", formData);

  const result = uploadFileResponseSchema.parse(response.data);

  return result.file;
};

/* -------------------------------------------------- */
/* Upload Cover Letter */
/* -------------------------------------------------- */

export const uploadCoverLetter = async (
  file: File
): Promise<UploadedFile> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileType", "COVER_LETTER");

  const response = await api.post("/files", formData);

  const result = uploadFileResponseSchema.parse(response.data);

  return result.file;
};

export const deleteFile = async (
  fileId: string,
): Promise<void> => {
  await api.delete(`/files/${fileId}`);
};

export const getFileUrl = async (
  fileId: string,
): Promise<string> => {
  const response = await api.get(`/files/${fileId}/url`);

  return response.data.url;
};