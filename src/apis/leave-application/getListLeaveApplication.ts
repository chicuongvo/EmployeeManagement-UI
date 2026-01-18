import requestApi from "@/utils/requestApi";
import type {
  GetListLeaveApplicationRequest,
  GetListLeaveApplicationResponse,
} from "./model/LeaveApplication";

const endpoints = {
  leaveApplication: "/leave-applications",
};

const getList =
  (url: string) =>
  async (
    params: GetListLeaveApplicationRequest,
  ): Promise<GetListLeaveApplicationResponse> =>
    requestApi.get<GetListLeaveApplicationResponse>(url, params);

export const getListLeaveApplication = getList(endpoints.leaveApplication);
