import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    epic: (id: number) => `/epics/${id}`,
};

const deleteEpic =
    (url: string) =>
        async (): Promise<BaseResponse> =>
            requestApi.delete<BaseResponse>(url);

export const deleteEpicById = (id: number) => deleteEpic(endpoints.epic(id))();
