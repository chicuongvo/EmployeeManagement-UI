import requestApi from "@/utils/requestApi";
import type { Task } from "./model/Task";

interface TaskResponse {
    success: boolean;
    message: string;
    data: Task;
}

const endpoints = {
    getTaskById: (taskId: number) => `/tasks/${taskId}`,
};

const getById =
    (url: string) =>
        async (): Promise<TaskResponse> =>
            requestApi.get<TaskResponse>(url);

export const getTaskById = (taskId: number) => getById(endpoints.getTaskById(taskId));
