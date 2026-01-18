import requestApi from "@/utils/requestApi";
import type {
  UpdateLeaveApplicationRequest,
  UpdateLeaveApplicationResponse,
} from "./model/LeaveApplication";

const endpoints = {
  leaveApplication: "/leave-applications",
};

export const updateLeaveApplication = async (
  applicationId: number,
  data: UpdateLeaveApplicationRequest,
): Promise<UpdateLeaveApplicationResponse> =>
  requestApi.put<UpdateLeaveApplicationResponse>(
    `${endpoints.leaveApplication}/${applicationId}`,
    data,
  );
