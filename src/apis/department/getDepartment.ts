import axiosApi from "@/utils/axiosApi";
import type { DEPARTMENT } from "./model/Department";

export const getDepartment = async (id: number): Promise<DEPARTMENT> => {
  const response = await axiosApi.get<{
    code: string;
    data: DEPARTMENT;
  }>(`/department/${id}`);

  return response.data.data;
};
