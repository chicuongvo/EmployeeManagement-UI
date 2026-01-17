import { axiosClient } from "@/lib/axios";
import type { Performance, PerformanceDetail } from "./model/Performance";

export type { Performance, PerformanceDetail };

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface PerformanceResponseAll {
    code: string;
    data: { data: Performance[] };
    pagination: Pagination;
}

interface PerformanceResponse {
    code: string;
    data: Performance;
}

export const performanceService = {
    getAll: async (): Promise<Performance[]> => {
        const { data } =
            await axiosClient.get<PerformanceResponseAll>("/performance");
        return data.data.data;
    },

    getById: async (id: number): Promise<Performance> => {
        const { data } = await axiosClient.get<PerformanceResponse>(
            `/performance/${id}`,
        );
        return data.data;
    },

    create: async (month: number, year: number): Promise<Performance> => {
        const { data } = await axiosClient.post<PerformanceResponse>(
            "/performance",
            { month, year },
        );
        return data.data;
    },
};
