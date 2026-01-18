import { axiosClient } from "@/lib/axios";

export interface PerformanceCriteria {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export interface PerformanceCriteriaCreate {
    name: string;
    description: string;
}

interface PerformanceCriteriaResponseAll {
    code: string;
    data: { data: PerformanceCriteria[] };
}

interface PerformanceCriteriaResponse {
    code: string;
    data: PerformanceCriteria;
}

export const performanceCriteriaService = {
    getAll: async (): Promise<PerformanceCriteria[]> => {
        const { data } = await axiosClient.get<PerformanceCriteriaResponseAll>("/performance-criteria");
        return data.data.data;
    },

    getById: async (id: number): Promise<PerformanceCriteria> => {
        const { data } = await axiosClient.get<PerformanceCriteriaResponse>(`/performance-criteria/${id}`);
        return data.data;
    },

    create: async (newData: PerformanceCriteriaCreate): Promise<PerformanceCriteria> => {
        const { data } = await axiosClient.post<PerformanceCriteriaResponse>("/performance-criteria", newData);
        return data.data;
    },

    update: async (id: number, updateData: PerformanceCriteriaCreate): Promise<PerformanceCriteria> => {
        const { data } = await axiosClient.put<PerformanceCriteriaResponse>(`/performance-criteria/${id}`, updateData);
        return data.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/performance-criteria/${id}`);
    }
};
