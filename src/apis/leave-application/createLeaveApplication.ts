import requestApi from "@/utils/requestApi";
import type {
  CreateLeaveApplicationRequest,
  CreateLeaveApplicationResponse,
} from "./model/LeaveApplication";

const endpoints = {
  leaveApplication: "/leave-applications",
};

export const createLeaveApplication = async (
  data: CreateLeaveApplicationRequest,
): Promise<CreateLeaveApplicationResponse> =>
  requestApi.post<CreateLeaveApplicationResponse>(
    endpoints.leaveApplication,
    data,
  );
