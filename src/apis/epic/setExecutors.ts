import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    setExecutors: (epicId: number) => `/epics/${epicId}/executors`,
};

const setExecutors =
    (url: string) =>
        async (employeeIds: number[]): Promise<BaseResponse<void>> =>
            requestApi.put<BaseResponse<void>>(url, { employeeIds });

export const setEpicExecutors = (epicId: number) => setExecutors(endpoints.setExecutors(epicId));
