import { axiosClient } from "@/lib/axios";

export interface AttendanceCorrectionRequest {
  id: number;
  employeeId: number;
  attendanceReportDetailId: number;
  requestDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedById?: number;
  reviewedAt?: string;
  createdAt: string;
  employee: {
    id: number;
    fullName: string;
    employeeCode: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
  };
  attendanceReportDetail?: {
    id: number;
    checkinTime?: string;
    checkoutTime?: string;
    attendanceReport: {
      day: number;
      month: number;
      year: number;
    };
  };
}

export interface CreateAttendanceCorrectionRequestDto {
  requestDate: string;
  reason: string;
}

export interface GetAttendanceCorrectionRequestsParams {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: number;
}

export interface AttendanceCorrectionResponse {
  code: number;
  message: string;
  data: {
    data: AttendanceCorrectionRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const endpoints = {
  base: "/attendance-correction",
  myRequests: "/attendance-correction/my-requests",
  approve: (id: number) => `/attendance-correction/${id}/approve`,
  reject: (id: number) => `/attendance-correction/${id}/reject`,
  getById: (id: number) => `/attendance-correction/${id}`,
};

export const createAttendanceCorrectionRequest = async (
  data: CreateAttendanceCorrectionRequestDto,
) => {
  const response = await axiosClient.post(endpoints.base, data);
  return response.data;
};

export const getMyAttendanceCorrectionRequests = async (
  params?: GetAttendanceCorrectionRequestsParams,
) => {
  const response = await axiosClient.get<AttendanceCorrectionResponse>(
    endpoints.myRequests,
    { params },
  );
  return response.data;
};

export const getAllAttendanceCorrectionRequests = async (
  params?: GetAttendanceCorrectionRequestsParams,
) => {
  const response = await axiosClient.get<AttendanceCorrectionResponse>(
    endpoints.base,
    { params },
  );
  return response.data;
};

export const getAttendanceCorrectionRequestById = async (id: number) => {
  const response = await axiosClient.get(endpoints.getById(id));
  return response.data;
};

export const approveAttendanceCorrectionRequest = async (id: number) => {
  const response = await axiosClient.put(endpoints.approve(id));
  return response.data;
};

export const rejectAttendanceCorrectionRequest = async (id: number) => {
  const response = await axiosClient.put(endpoints.reject(id));
  return response.data;
};
