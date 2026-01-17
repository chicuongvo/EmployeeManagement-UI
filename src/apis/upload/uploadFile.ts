import { axiosClientFormData } from "@/lib/axios";
import type {
  UploadSingleResponse,
  UploadMultipleResponse,
} from "./model/Upload";

const endpoints = {
  uploadSingle: "/upload/single",
  uploadMultiple: "/upload/multiple",
};

/**
 * Upload single file
 * @param file File to upload
 * @returns Upload response with file URL and metadata
 */
export const uploadSingleFile = async (
  file: File
): Promise<UploadSingleResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClientFormData.post<UploadSingleResponse>(
    endpoints.uploadSingle,
    formData
  );
  return response.data;
};

/**
 * Upload multiple files
 * @param files Array of files to upload
 * @returns Upload response with array of file URLs and metadata
 */
export const uploadMultipleFiles = async (
  files: File[]
): Promise<UploadMultipleResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosClientFormData.post<UploadMultipleResponse>(
    endpoints.uploadMultiple,
    formData
  );
  return response.data;
};

