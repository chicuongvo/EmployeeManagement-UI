import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    setAssignments: (taskId: number) => `/tasks/${taskId}/assignments`,
};

const setAssignments =
    (url: string) =>
        async (employeeIds: number[]): Promise<BaseResponse> =>
            requestApi.put<BaseResponse>(url, { employeeIds });

export const setTaskAssignments = (taskId: number) => setAssignments(endpoints.setAssignments(taskId));
