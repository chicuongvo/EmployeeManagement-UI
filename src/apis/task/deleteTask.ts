import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    task: (id: number) => `/tasks/${id}`,
};

const deleteTask =
    (url: string) =>
        async (): Promise<BaseResponse<void>> =>
            requestApi.delete<BaseResponse<void>>(url);

export const deleteTaskById = (id: number) => deleteTask(endpoints.task(id))();
