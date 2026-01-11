import requestApi from "@/utils/requestApi";
import type { CreateEpicRequest, EpicResponse } from "./model/Epic";

const endpoints = {
    epics: (projectId: number) => `/projects/${projectId}/epics`,
};

const create =
    (url: string) =>
        async (data: CreateEpicRequest): Promise<EpicResponse> =>
            requestApi.post<EpicResponse>(url, data);

export const createEpic = (projectId: number) => create(endpoints.epics(projectId));
