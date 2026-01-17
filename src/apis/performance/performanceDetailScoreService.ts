import { axiosClient } from "@/lib/axios";

export interface PerformanceDetailScoreCreate {
    performanceReportDetailId: number;
    performanceCriteriaId: number;
    score: number;
}

export interface PerformanceDetailScoreUpdate {
    performanceCriteriaId: number;
    score: number;
}

interface PerformanceDetailScoreResponse {
    code: string;
    data: PerformanceDetailScoreCreate;
}

export const performanceDetailScoreService = {
    create: async (payload: PerformanceDetailScoreCreate): Promise<PerformanceDetailScoreCreate> => {
        const { data } = await axiosClient.post<PerformanceDetailScoreResponse>(
            "/performance-detail-score",
            payload,
        );
        return data.data;
    },

    update: async (id: number, payload: PerformanceDetailScoreUpdate): Promise<PerformanceDetailScoreCreate> => {
        const { data } = await axiosClient.put<PerformanceDetailScoreResponse>(
            `/performance-detail-score/${id}`,
            payload,
        );
        return data.data;
    },
};
