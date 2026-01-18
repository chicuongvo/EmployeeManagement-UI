import type { Notification } from "@/apis/notification";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationItemProps) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.publishedAt), {
    addSuffix: true,
  });

  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm mb-1 ${
              !notification.isRead
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-700"
            }`}
          >
            {notification.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
            {notification.content}
          </p>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};
