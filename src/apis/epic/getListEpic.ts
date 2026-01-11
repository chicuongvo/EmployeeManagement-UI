import requestApi from "@/utils/requestApi";
import type { GetListEpicResponse } from "./model/Epic";

const endpoints = {
    epics: (projectId: number) => `/projects/${projectId}/epics`,
};

const getList =
    (url: string) =>
        async (): Promise<GetListEpicResponse> =>
            requestApi.get<GetListEpicResponse>(url);

export const getListEpic = (projectId: number) => getList(endpoints.epics(projectId))();
