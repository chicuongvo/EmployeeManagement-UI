import type { PaginationResponse } from "@/types/pagination";
import type { BaseResponse } from "@/types/common";

export const ProjectStatus = {
    PLANNING: "PLANNING",
    IN_PROGRESS: "IN_PROGRESS",
    ON_HOLD: "ON_HOLD",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Employee {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
    employeeCode?: string;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    status: ProjectStatus;
    budget?: number;
    createdAt: string;
    updatedAt: string;
    managerId?: number;
    manager?: Employee;
    members?: ProjectMember[];
    _count?: {
        members: number;
    };
}

export interface ProjectMember {
    id: number;
    projectId: number;
    employeeId: number;
    role?: string;
    joinedAt: string;
    employee: Employee;
}

export interface GetListProjectRequest {
    page?: number;
    limit?: number;
    q?: string;
    name?: string;
    status?: ProjectStatus;
    managerId?: number;
    created_date_from?: number;
    created_date_to?: number;
    updated_date_from?: number;
    updated_date_to?: number;
    start_date_from?: number;
    start_date_to?: number;
    end_date_from?: number;
    end_date_to?: number;
}

export interface GetListProjectResponse extends PaginationResponse<Project> { }

export interface CreateProjectRequest {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    status: ProjectStatus;
    budget?: number;
    managerId?: number;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: ProjectStatus;
    budget?: number;
    managerId?: number;
}

export interface ProjectResponse extends BaseResponse, Project { }
