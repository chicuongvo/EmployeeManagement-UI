import type { BaseResponse } from "@/types/common";

export const TaskStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    IN_REVIEW: "IN_REVIEW",
    DONE: "DONE",
    CANCELLED: "CANCELLED"
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL"
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Employee {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
}

export interface TaskAssignment {
    id: number;
    taskId: number;
    employeeId: number;
    assignedAt: string;
    employee: Employee;
}

export interface Task {
    id: number;
    name: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    epicId: number;
    parentTaskId?: number;
    createdAt: string;
    updatedAt: string;
    assignments?: TaskAssignment[];
    subtasks?: Task[];
}

export interface GetTasksByEpicRequest {
    epicId: number;
}

export interface GetTasksByEpicResponse extends BaseResponse {
    data: Task[];
}

export interface CreateTaskRequest {
    name: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    parentTaskId?: number;
}

export interface UpdateTaskRequest {
    name?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    parentTaskId?: number;
}

export interface TaskResponse extends BaseResponse {
    data: Task;
}
