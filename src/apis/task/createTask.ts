import requestApi from "@/utils/requestApi";
import type { CreateTaskRequest, TaskResponse } from "./model/Task";

const endpoints = {
    tasks: (epicId: number) => `/epics/${epicId}/tasks`,
};

const create =
    (url: string) =>
        async (data: CreateTaskRequest): Promise<TaskResponse> =>
            requestApi.post<TaskResponse>(url, data);

export const createTask = (epicId: number) => create(endpoints.tasks(epicId));
