import requestApi from "@/utils/requestApi";
import type {
  GetListPositionRequest,
  GetListPositionResponse,
} from "./model/Position";

const endpoints = {
  position: "/position",
};

const getList =
  (url: string) =>
  async (params: GetListPositionRequest): Promise<GetListPositionResponse> =>
    requestApi.get<GetListPositionResponse>(url, params);

export const getListPosition = getList(endpoints.position);
