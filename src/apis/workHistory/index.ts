import { axiosClient } from "@/lib/axios";
import type {
    GetWorkHistoryListRequest,
    GetWorkHistoryListResponse,
    GetWorkHistoryRequest,
    GetWorkHistoryResponse,
} from "./model/WorkHistory";

export const getWorkHistoryList = async (
    params: GetWorkHistoryListRequest
): Promise<GetWorkHistoryListResponse> => {
    const response = await axiosClient.get("/work-history", { params });
    return response.data;
};

export const getWorkHistory = async (
    params: GetWorkHistoryRequest
): Promise<GetWorkHistoryResponse> => {
    const response = await axiosClient.get(`/work-history/${params.id}`);
    return response.data;
};
