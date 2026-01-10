import requestApi from "@/utils/requestApi";
import type { GetListEmployeeRequest, GetListEmployeeResponse } from "./model/Employee";


const endpoints = {
    employee: "/employee",
};

const getList =
    (url: string) =>
        async (params: GetListEmployeeRequest): Promise<GetListEmployeeResponse> =>
            requestApi.get<GetListEmployeeResponse>(url, params);

export const getListEmployee = getList(endpoints.employee);
