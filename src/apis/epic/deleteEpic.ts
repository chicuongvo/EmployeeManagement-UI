import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    epic: (id: number) => `/epics/${id}`,
};

const deleteEpic =
    (url: string) =>
        async (): Promise<BaseResponse<void>> =>
            requestApi.delete<BaseResponse<void>>(url);

export const deleteEpicById = (id: number) => deleteEpic(endpoints.epic(id))();
