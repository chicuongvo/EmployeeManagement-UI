import requestApi from "@/utils/requestApi";
import type {
  GetListDepartmentRequest,
  GetListDepartmentResponse,
} from "./model/Department";

const endpoints = {
  department: "/department",
};

const getList =
  (url: string) =>
  async (
    params: GetListDepartmentRequest
  ): Promise<GetListDepartmentResponse> =>
    requestApi.get<GetListDepartmentResponse>(url, params);

export const getListDepartment = getList(endpoints.department);
