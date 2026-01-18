import requestApi from "../../utils/requestApi";
import type { NotificationListResponse } from "./model/Notification";

interface GetListNotificationParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export const getListNotification = async (
  params?: GetListNotificationParams,
): Promise<NotificationListResponse> => {
  return requestApi.get<NotificationListResponse>("/notifications", params);
};
