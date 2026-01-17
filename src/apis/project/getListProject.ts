import requestApi from "@/utils/requestApi";
import type { GetListProjectRequest, GetListProjectResponse } from "./model/Project";

const endpoints = {
    project: "/projects",
};

const getList =
    (url: string) =>
        async (params: GetListProjectRequest): Promise<GetListProjectResponse> =>
            requestApi.get<GetListProjectResponse>(url, params);

export const getListProject = getList(endpoints.project);
