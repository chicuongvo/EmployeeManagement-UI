import requestApi from "@/utils/requestApi";
import type { BaseResponse } from "@/types/common";

const endpoints = {
    project: "/projects",
};

export const deleteProject = async (id: number): Promise<BaseResponse<void>> =>
    requestApi.delete<BaseResponse<void>>(`${endpoints.project}/${id}`);
