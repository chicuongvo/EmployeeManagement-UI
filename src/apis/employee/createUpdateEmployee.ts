/* eslint-disable @typescript-eslint/no-empty-object-type */
import { usePost, type UsePostOptions } from "@/hooks/reactQuery";
import type { BaseResponse } from "@/types/common";

import requestApi from "@/utils/requestApi";

import type {
  EMPLOYEE,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "./model/Employee";

export interface EmployeeResponse extends BaseResponse<EMPLOYEE> {}

const urlEmployee = "/employee";

export const createEmployee = async (
  req: CreateEmployeeRequest
): Promise<EmployeeResponse> => {
  return await requestApi.post<EmployeeResponse>(urlEmployee, req, {
    hideMessage: true,
  });
};

export const updateEmployee = async (
  id: number,
  req: UpdateEmployeeRequest
): Promise<EmployeeResponse> => {
  return await requestApi.put<EmployeeResponse>(`${urlEmployee}/${id}`, req, {
    hideMessage: true,
  });
};

export const useCreateEmployee = (
  options?: UsePostOptions<EmployeeResponse, CreateEmployeeRequest>
) => {
  return usePost({
    mutationFn: createEmployee,
    messageSuccess: {
      content: "Employee created successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

export const useUpdateEmployee = (
  id: number,
  options?: UsePostOptions<EmployeeResponse, UpdateEmployeeRequest>
) => {
  return usePost({
    mutationFn: (req: UpdateEmployeeRequest) => updateEmployee(id, req),
    messageSuccess: {
      content: "Employee updated successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};
