import type { BaseResponse } from "@/types/common";

export const EpicStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
    CANCELLED: "CANCELLED"
} as const;

export type EpicStatus = typeof EpicStatus[keyof typeof EpicStatus];

export const EpicPriority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL"
} as const;

export type EpicPriority = typeof EpicPriority[keyof typeof EpicPriority];

export interface Employee {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
}

export interface EpicExecutor {
    id: number;
    epicId: number;
    employeeId: number;
    assignedAt: string;
    employee: Employee;
}

export interface Epic {
    id: number;
    name: string;
    description?: string;
    status: EpicStatus;
    priority: EpicPriority;
    startDate?: string;
    endDate?: string;
    projectId: number;
    createdAt: string;
    updatedAt: string;
    executors?: EpicExecutor[];
    _count?: {
        tasks: number;
    };
}

export interface GetListEpicRequest {
    projectId: number;
    status?: EpicStatus;
    priority?: EpicPriority;
    q?: string;
}

export interface GetListEpicResponse extends BaseResponse {
    data: Epic[];
}

export interface CreateEpicRequest {
    name: string;
    description?: string;
    status?: EpicStatus;
    priority?: EpicPriority;
    startDate?: string;
    endDate?: string;
}

export interface UpdateEpicRequest {
    name?: string;
    description?: string;
    status?: EpicStatus;
    priority?: EpicPriority;
    startDate?: string;
    endDate?: string;
}

export interface EpicResponse extends BaseResponse {
    data: Epic;
}
