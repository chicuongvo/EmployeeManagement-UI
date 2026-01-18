import * as updateRequestApi from "../api/update-request.api";
import type {
  UpdateRequestResponse,
  CreateUpdateRequestRequest,
  UpdateUpdateRequestRequest,
  AssignReviewerRequest,
  ReviewRequestRequest,
  UpdateRequestQueryParams,
} from "../types/UpdateRequest";

export const getAllUpdateRequests = async (
  params?: UpdateRequestQueryParams
): Promise<UpdateRequestResponse[]> => {
  return updateRequestApi.getAllUpdateRequests(params);
};

export const getUpdateRequestById = async (
  requestId: number
): Promise<UpdateRequestResponse> => {
  return updateRequestApi.getUpdateRequestById(requestId);
};

export const createUpdateRequest = async (
  data: CreateUpdateRequestRequest
): Promise<UpdateRequestResponse> => {
  return updateRequestApi.createUpdateRequest(data);
};

export const updateUpdateRequest = async (
  requestId: number,
  data: UpdateUpdateRequestRequest
): Promise<UpdateRequestResponse> => {
  return updateRequestApi.updateUpdateRequest(requestId, data);
};

export const deleteUpdateRequest = async (
  requestId: number
): Promise<{ message: string }> => {
  return updateRequestApi.deleteUpdateRequest(requestId);
};

export const assignReviewer = async (
  requestId: number,
  data: AssignReviewerRequest
): Promise<UpdateRequestResponse> => {
  return updateRequestApi.assignReviewer(requestId, data);
};

export const reviewRequest = async (
  requestId: number,
  data: ReviewRequestRequest
): Promise<UpdateRequestResponse> => {
  return updateRequestApi.reviewRequest(requestId, data);
};

