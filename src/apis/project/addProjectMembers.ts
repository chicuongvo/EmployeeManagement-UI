import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    bulkAddEmployees: (projectId: number) => `/projects/${projectId}/employees/bulk`,
};

const addMembers =
    (url: string) =>
        async (employeeIds: number[]): Promise<BaseResponse> =>
            requestApi.post<BaseResponse>(url, { employeeIds });

export const addProjectMembers = (projectId: number) => addMembers(endpoints.bulkAddEmployees(projectId));
