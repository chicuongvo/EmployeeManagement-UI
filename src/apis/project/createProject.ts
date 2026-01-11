import requestApi from "@/utils/requestApi";
import type { CreateProjectRequest, ProjectResponse } from "./model/Project";

const endpoints = {
    project: "/projects",
};

export const createProject = async (
    data: CreateProjectRequest
): Promise<ProjectResponse> =>
    requestApi.post<ProjectResponse>(endpoints.project, data);
