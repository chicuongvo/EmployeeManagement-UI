import requestApi from "@/utils/requestApi";
import type { UpdateTaskRequest, TaskResponse } from "./model/Task";

const endpoints = {
    task: (id: number) => `/tasks/${id}`,
};

const update =
    (url: string) =>
        async (data: UpdateTaskRequest): Promise<TaskResponse> =>
            requestApi.put<TaskResponse>(url, data);

export const updateTask = (id: number) => update(endpoints.task(id));
