import { Badge, Dropdown, Spin, Empty, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getListNotification,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "@/apis/notification";
import type { Notification } from "@/apis/notification/model/Notification";
import { NotificationItem } from "./NotificationItem";
import { toast } from "react-toastify";

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch notifications list
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => getListNotification({ page: 1, limit: 10 }),
    enabled: open, // Only fetch when dropdown is open
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Không thể đánh dấu là đã đọc");
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(
        `Đã đánh dấu ${data.data.updatedCount} thông báo là đã đọc`,
      );
    },
    onError: () => {
      toast.error("Không thể đánh dấu tất cả là đã đọc");
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = (notification: Notification) => {
    // You can add navigation logic here if needed
    console.log("Notification clicked:", notification);
  };

  const unreadCount = unreadData?.data?.unreadCount || 0;
  const notifications = notificationsData?.data?.notifications || [];

  const dropdownContent = (
    <div className="w-96 max-h-[500px] overflow-hidden bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Thông báo</h3>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            loading={markAllAsReadMutation.isPending}
            className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8">
            <Empty
              description="Không có thông báo"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 text-center">
          <a
            href="/notifications"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            onClick={e => {
              e.preventDefault();
              // Add navigation logic here
              console.log("View all notifications");
            }}
          >
            Xem tất cả thông báo
          </a>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={false}
    >
      <div className="cursor-pointer hover:opacity-80 transition-opacity">
        <Badge count={unreadCount} overflowCount={99} offset={[-4, 4]}>
          <BellOutlined
            style={{
              fontSize: 20,
              color: "#000",
            }}
          />
        </Badge>
      </div>
    </Dropdown>
  );
};
