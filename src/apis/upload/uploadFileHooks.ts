import { usePost, type UsePostOptions } from "@/hooks/reactQuery";
import type {
  UploadSingleResponse,
  UploadMultipleResponse,
} from "./model/Upload";
import { uploadSingleFile, uploadMultipleFiles } from "./uploadFile";

export const useUploadFile = (
  options?: UsePostOptions<UploadSingleResponse, File>
) => {
  return usePost({
    mutationFn: uploadSingleFile,
    messageSuccess: {
      content: "File uploaded successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

export const useUploadFiles = (
  options?: UsePostOptions<UploadMultipleResponse, File[]>
) => {
  return usePost({
    mutationFn: uploadMultipleFiles,
    messageSuccess: {
      content: "Files uploaded successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

