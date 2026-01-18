import { axiosClient } from "../lib/axios";

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
  userId: string;
  userName: string;
  userImage: string | null;
  departmentId: number | null;
  departmentName: string | null;
  callId: string;
}

export interface VerifyAccessResponse {
  canJoin: boolean;
  departmentId: number | null;
  departmentName: string | null;
  message?: string;
}

export interface DepartmentCallIdResponse {
  callId: string;
  departmentId: number;
  departmentName: string | null;
}

/**
 * Generate Stream token for video calling
 */
export const generateStreamToken = async (
  callId?: string
): Promise<StreamTokenResponse> => {
  const response = await axiosClient.post("/stream/token", { callId });
  return response.data.data;
};

/**
 * Verify if user can join a call
 */
export const verifyCallAccess = async (
  callId: string
): Promise<VerifyAccessResponse> => {
  const response = await axiosClient.post("/stream/verify-access", { callId });
  return response.data.data;
};

/**
 * Get department call ID for current user
 */
export const getDepartmentCallId =
  async (): Promise<DepartmentCallIdResponse> => {
    const response = await axiosClient.get("/stream/department-call-id");
    return response.data.data;
  };

