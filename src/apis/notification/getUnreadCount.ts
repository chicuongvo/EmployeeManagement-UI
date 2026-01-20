import requestApi from "../../utils/requestApi";
import type { UnreadCountResponse } from "./model/Notification";

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  return requestApi.get<UnreadCountResponse>("/notifications/unread-count", { hideMessage: true });
};
