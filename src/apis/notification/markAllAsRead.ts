import requestApi from "../../utils/requestApi";
import type { MarkAllAsReadResponse } from "./model/Notification";

export const markAllAsRead = async (): Promise<MarkAllAsReadResponse> => {
  return requestApi.put<MarkAllAsReadResponse>(
    "/notifications/mark-all-read",
    {},
  );
};
