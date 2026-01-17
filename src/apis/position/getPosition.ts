import axiosApi from "@/utils/axiosApi";
import type { POSITION } from "./model/Position";

export const getPosition = async (id: number): Promise<POSITION> => {
  const response = await axiosApi.get<{
    code: string;
    data: POSITION;
  }>(`/position/${id}`);

  return response.data.data;
};

