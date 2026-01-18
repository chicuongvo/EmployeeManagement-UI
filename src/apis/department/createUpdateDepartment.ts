import { usePost, type UsePostOptions } from "@/hooks/reactQuery";
import type { BaseResponse } from "@/types/common";

import requestApi from "@/utils/requestApi";

import type {
  DEPARTMENT,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "./model/Department";

export interface DepartmentResponse extends BaseResponse<DEPARTMENT> { }

const urlDepartment = "/department";

export const createDepartment = async (
  req: CreateDepartmentRequest
): Promise<DepartmentResponse> => {
  return await requestApi.post<DepartmentResponse>(urlDepartment, req, {
    hideMessage: true,
  });
};

export const updateDepartment = async (
  id: number,
  req: UpdateDepartmentRequest
): Promise<DepartmentResponse> => {
  return await requestApi.put<DepartmentResponse>(
    `${urlDepartment}/${id}`,
    req,
    {
      hideMessage: true,
    }
  );
};

export const useCreateDepartment = (
  options?: UsePostOptions<DepartmentResponse, CreateDepartmentRequest>
) => {
  return usePost({
    mutationFn: createDepartment,
    messageSuccess: {
      content: "Department created successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

export const useUpdateDepartment = (
  id: number,
  options?: UsePostOptions<DepartmentResponse, UpdateDepartmentRequest>
) => {
  return usePost({
    mutationFn: (req: UpdateDepartmentRequest) => updateDepartment(id, req),
    messageSuccess: {
      content: "Department updated successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};
