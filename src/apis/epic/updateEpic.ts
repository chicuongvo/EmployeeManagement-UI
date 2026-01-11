import requestApi from "@/utils/requestApi";
import type { UpdateEpicRequest, EpicResponse } from "./model/Epic";

const endpoints = {
    epic: (id: number) => `/epics/${id}`,
};

const update =
    (url: string) =>
        async (data: UpdateEpicRequest): Promise<EpicResponse> =>
            requestApi.put<EpicResponse>(url, data);

export const updateEpic = (id: number) => update(endpoints.epic(id));
