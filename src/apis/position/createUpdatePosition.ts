import { usePost, type UsePostOptions } from "@/hooks/reactQuery";
import type { BaseResponse } from "@/types/common";

import requestApi from "@/utils/requestApi";

import type {
  POSITION,
  CreatePositionRequest,
  UpdatePositionRequest,
} from "./model/Position";

export interface PositionResponse extends BaseResponse<POSITION> { }

const urlPosition = "/position";

export const createPosition = async (
  req: CreatePositionRequest
): Promise<PositionResponse> => {
  return await requestApi.post<PositionResponse>(urlPosition, req, {
    // hideMessage: true,
  });
};

export const updatePosition = async (
  id: number,
  req: UpdatePositionRequest
): Promise<PositionResponse> => {
  return await requestApi.put<PositionResponse>(
    `${urlPosition}/${id}`,
    req,
    {
      hideMessage: true,
    }
  );
};

export const useCreatePosition = (
  options?: UsePostOptions<PositionResponse, CreatePositionRequest>
) => {
  return usePost({
    mutationFn: createPosition,
    messageSuccess: {
      content: "Position created successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

export const useUpdatePosition = (
  id: number,
  options?: UsePostOptions<PositionResponse, UpdatePositionRequest>
) => {
  return usePost({
    mutationFn: (req: UpdatePositionRequest) => updatePosition(id, req),
    messageSuccess: {
      content: "Position updated successfully",
      type: "toast",
    },
    messageError: {
      type: "toast",
    },
    ...options,
  });
};

