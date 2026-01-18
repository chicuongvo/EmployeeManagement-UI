import { axiosClient } from "@/lib/axios";
import type { PerformanceDetail } from "./model/Performance";

export interface PerformanceDetailCreate {
    employeeId: number;
    supervisorId: number;
    performanceReportId: number;
    // Optional: attach scores if backend supports
    scores?: Array<{ criteriaId: number; score: number }>;
}

export interface PerformanceDetailUpdate {
    scores: Array<{ criteriaId: number; score: number }>;
}

interface PerformanceDetailResponse {
    code: string;
    data: PerformanceDetail;
}

interface PerformanceDetailResponseAll {
    code: string;
    data: { data: PerformanceDetail[] };
}

export const performanceDetailService = {
    getAll: async (): Promise<PerformanceDetail[]> => {
        const { data } = await axiosClient.get<PerformanceDetailResponseAll>("/performance-detail");
        return data.data.data;
    },

    getById: async (id: number): Promise<PerformanceDetail> => {
        const { data } = await axiosClient.get<PerformanceDetailResponse>(`/performance-detail/${id}`);
        return data.data;
    },

    create: async (payload: PerformanceDetailCreate): Promise<PerformanceDetail> => {
        const { data } = await axiosClient.post<PerformanceDetailResponse>("/performance-detail", payload);
        return data.data;
    },

    update: async (id: number, payload: PerformanceDetailUpdate): Promise<PerformanceDetail> => {
        const { data } = await axiosClient.put<PerformanceDetailResponse>(`/performance-detail/${id}`, payload);
        return data.data;
    },
};
