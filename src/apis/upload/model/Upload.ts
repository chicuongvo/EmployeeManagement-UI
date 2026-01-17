import type { BaseResponse } from "@/types/common";

export interface UploadFileResponse {
  url: string;
  file_name: string;
  filename?: string; // Backward compatibility
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadSingleResponse extends BaseResponse<UploadFileResponse> {}

export interface UploadMultipleResponse
  extends BaseResponse<{ files: UploadFileResponse[] }> {}

