import { axiosClient } from "../lib/axios";
import type {
  UpdateRequestResponse,
  CreateUpdateRequestRequest,
  UpdateUpdateRequestRequest,
  AssignReviewerRequest,
  ReviewRequestRequest,
  UpdateRequestQueryParams,
} from "../types/UpdateRequest";

// Get all update requests
export const getAllUpdateRequests = async (
  params?: UpdateRequestQueryParams
): Promise<UpdateRequestResponse[]> => {
  const response = await axiosClient.get("/update-request", { params });
  // Backend returns { data: UpdateRequestResponse[], pagination: {...} }
  const result = response.data.data;
  return Array.isArray(result) ? result : result?.data || [];
};

// Get update request by ID
export const getUpdateRequestById = async (
  requestId: number
): Promise<UpdateRequestResponse> => {
  const response = await axiosClient.get(`/update-request/${requestId}`);
  return response.data.data;
};

// Create update request
export const createUpdateRequest = async (
  data: CreateUpdateRequestRequest
): Promise<UpdateRequestResponse> => {
  const response = await axiosClient.post("/update-request", data);
  return response.data.data;
};

// Update update request
export const updateUpdateRequest = async (
  requestId: number,
  data: UpdateUpdateRequestRequest
): Promise<UpdateRequestResponse> => {
  const response = await axiosClient.put(`/update-request/${requestId}`, data);
  return response.data.data;
};

// Delete update request
export const deleteUpdateRequest = async (
  requestId: number
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/update-request/${requestId}`);
  return response.data;
};

// Assign reviewer to update request
export const assignReviewer = async (
  requestId: number,
  data: AssignReviewerRequest
): Promise<UpdateRequestResponse> => {
  const response = await axiosClient.put(
    `/update-request/${requestId}/assign-reviewer`,
    data
  );
  return response.data.data;
};

// Review update request
export const reviewRequest = async (
  requestId: number,
  data: ReviewRequestRequest
): Promise<UpdateRequestResponse> => {
  const response = await axiosClient.put(
    `/update-request/${requestId}/review`,
    data
  );
  return response.data.data;
};

