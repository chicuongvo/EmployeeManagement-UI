import requestApi from "@/utils/requestApi";
import type { GetTasksByEpicResponse } from "./model/Task";

const endpoints = {
    tasks: (epicId: number) => `/epics/${epicId}/tasks`,
};

const getList =
    (url: string) =>
        async (): Promise<GetTasksByEpicResponse> =>
            requestApi.get<GetTasksByEpicResponse>(url);

export const getTasksByEpic = (epicId: number) => getList(endpoints.tasks(epicId))();

console.log("@getTasksByEpic");
console.log(getTasksByEpic(15).then(response => console.log(response)));