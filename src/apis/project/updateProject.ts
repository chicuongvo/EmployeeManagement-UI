import requestApi from "@/utils/requestApi";
import type { UpdateProjectRequest, ProjectResponse } from "./model/Project";

const endpoints = {
    project: "/projects",
};

export const updateProject = async (
    id: number,
    data: UpdateProjectRequest
): Promise<ProjectResponse> =>
    requestApi.put<ProjectResponse>(`${endpoints.project}/${id}`, data);
