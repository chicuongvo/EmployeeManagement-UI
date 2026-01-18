import requestApi from "@/utils/requestApi";
import type { NotificationListResponse } from "./model/Notification";

export interface CreateNotificationRequest {
  title: string;
  content: string;
  publishedAt?: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  content?: string;
  publishedAt?: string;
  isRead?: boolean;
}

export const createNotification = async (
  data: CreateNotificationRequest,
): Promise<NotificationListResponse> => {
  return requestApi.post<NotificationListResponse>(`/notifications`, data);
};

export const updateNotification = async (
  id: number,
  data: UpdateNotificationRequest,
): Promise<NotificationListResponse> => {
  return requestApi.put<NotificationListResponse>(`/notifications/${id}`, data);
};

export const deleteNotification = async (
  id: number,
): Promise<NotificationListResponse> => {
  return requestApi.delete<NotificationListResponse>(`/notifications/${id}`);
};
