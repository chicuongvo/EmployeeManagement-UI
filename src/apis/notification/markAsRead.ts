import requestApi from "../../utils/requestApi";
import type { MarkAsReadResponse } from "./model/Notification";

export const markAsRead = async (id: number): Promise<MarkAsReadResponse> => {
  return requestApi.put<MarkAsReadResponse>(`/notifications/${id}/read`, {});
};
