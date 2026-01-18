import requestApi from "@/utils/requestApi";
import type { ROLE } from "./model/Role";

export const getRole = async (id: number): Promise<ROLE> => {
    const response = await requestApi.get<{ data: ROLE }>(`/role/${id}`);
    return response.data;
};
