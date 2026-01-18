import requestApi from "@/utils/requestApi";
import type { Project } from "./model/Project";

interface ProjectDetailResponse {
    success: boolean;
    message: string;
    data: Project;
}

const endpoints = {
    project: (projectId: number) => `/projects/${projectId}`,
};

const getProject =
    (url: string) =>
        async (): Promise<ProjectDetailResponse> =>
            requestApi.get<ProjectDetailResponse>(url);

export const getProjectMembers = (projectId: number) => getProject(endpoints.project(projectId))();
