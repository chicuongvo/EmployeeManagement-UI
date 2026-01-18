import requestApi from "@/utils/requestApi";
import type { DeleteLeaveApplicationResponse } from "./model/LeaveApplication";

const endpoints = {
  leaveApplication: "/leave-applications",
};

export const deleteLeaveApplication = async (
  applicationId: number,
): Promise<DeleteLeaveApplicationResponse> =>
  requestApi.delete<DeleteLeaveApplicationResponse>(
    `${endpoints.leaveApplication}/${applicationId}`,
  );
