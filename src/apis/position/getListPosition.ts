import axiosApi from "@/utils/axiosApi";
import type {
  GetListPositionRequest,
  GetListPositionResponse,
} from "./model/Position";

export const getListPosition = async (
  params?: GetListPositionRequest
): Promise<GetListPositionResponse> => {
  const response = await axiosApi.get<{
    code: string;
    data: GetListPositionResponse;
  }>("/position", { params });

  return response.data.data;
};

