import requestApi from "@/utils/requestApi";
import type {
  GetListLeaveTypeRequest,
  GetListLeaveTypeResponse,
} from "./model/LeaveType";

const endpoints = {
  leaveType: "/leave-types",
};

const getList =
  (url: string) =>
  async (
    params: GetListLeaveTypeRequest
  ): Promise<GetListLeaveTypeResponse> =>
    requestApi.get<GetListLeaveTypeResponse>(url, params);

export const getListLeaveType = getList(endpoints.leaveType);
