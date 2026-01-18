import requestApi from "@/utils/requestApi";
import type {
  GetLeaveApplicationRequest,
  GetLeaveApplicationResponse,
} from "./model/LeaveApplication";

const endpoints = {
  leaveApplication: "/leave-applications",
};

export const getLeaveApplication = async (
  params: GetLeaveApplicationRequest,
): Promise<GetLeaveApplicationResponse> =>
  requestApi.get<GetLeaveApplicationResponse>(
    `${endpoints.leaveApplication}/${params.applicationId}`,
  );
