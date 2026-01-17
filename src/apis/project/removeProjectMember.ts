import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    employee: (projectId: number, employeeId: number) => `/projects/${projectId}/employees/${employeeId}`,
};

const removeMember =
    (url: string) =>
        async (): Promise<BaseResponse> =>
            requestApi.delete<BaseResponse>(url);

export const removeProjectMember = (projectId: number, employeeId: number) =>
    removeMember(endpoints.employee(projectId, employeeId))();
