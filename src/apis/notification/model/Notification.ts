export interface Notification {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  isRead: boolean;
  readAt: string | null;
  createdBy?: number;
  creatorName?: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
  data: {
    updatedCount: number;
  };
}
