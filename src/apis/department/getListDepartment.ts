import axiosApi from "@/utils/axiosApi";
import type {
  GetListDepartmentRequest,
  GetListDepartmentResponse,
} from "./model/Department";

export const getListDepartment = async (
  params?: GetListDepartmentRequest
): Promise<GetListDepartmentResponse> => {
  const response = await axiosApi.get<{
    code: string;
    data: GetListDepartmentResponse;
  }>("/department", { params });

  return response.data.data;
};
