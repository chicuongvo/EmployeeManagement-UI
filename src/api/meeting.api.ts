import { axiosClient } from "../lib/axios";
import type {
  MeetingResponse,
  CreateMeetingRequest,
  MeetingQueryParams,
} from "../types/Meeting";

interface GetListMeetingResponse {
  data: MeetingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all meetings
 */
export const getAllMeetings = async (
  params?: MeetingQueryParams
): Promise<GetListMeetingResponse> => {
  const response = await axiosClient.get("/stream/meetings", { params });
  return response.data.data;
};

/**
 * Get meeting by ID
 */
export const getMeetingById = async (
  id: string
): Promise<MeetingResponse> => {
  const response = await axiosClient.get(`/stream/meetings/${id}`);
  return response.data.data;
};

/**
 * Create a new meeting
 */
export const createMeeting = async (
  data: CreateMeetingRequest
): Promise<MeetingResponse> => {
  const response = await axiosClient.post("/stream/meetings", data);
  return response.data.data;
};

/**
 * Update meeting
 */
export const updateMeeting = async (
  id: string,
  data: Partial<CreateMeetingRequest> & { status?: MeetingStatus }
): Promise<MeetingResponse> => {
  const response = await axiosClient.put(`/stream/meetings/${id}`, data);
  return response.data.data;
};

/**
 * Delete meeting
 */
export const deleteMeeting = async (id: string): Promise<void> => {
  await axiosClient.delete(`/stream/meetings/${id}`);
};
