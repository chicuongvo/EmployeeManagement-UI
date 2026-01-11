import requestApi from "@/utils/requestApi";
import {
  type GetEmployeeRequest,
  type GetEmployeeResponse,
} from "./model/Employee";

const urlEmployee = "/employee";

export const getEmployee = async (
  request: GetEmployeeRequest
): Promise<GetEmployeeResponse> => {
  return await requestApi.get<GetEmployeeResponse>(
    `${urlEmployee}/${request.id}`
  );
};
