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
  console.log("Creating meeting with data:", data);
  console.log("Request URL:", axiosClient.defaults.baseURL + "/stream/meetings");
  try {
    const response = await axiosClient.post("/stream/meetings", data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating meeting - Status:", error.response?.status);
    console.error("Error creating meeting - URL:", error.config?.url);
    console.error("Error creating meeting - Full error:", error);
    throw error;
  }
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

/**
 * Update participant status
 */
export const updateParticipantStatus = async (
  meetingId: string,
  participantId: number,
  status: "PENDING" | "ACCEPTED" | "DECLINED"
): Promise<{ employeeId: number; status: string; employee: any }> => {
  const response = await axiosClient.put(
    `/stream/meetings/${meetingId}/participants/${participantId}/status`,
    { status }
  );
  return response.data.data;
};
