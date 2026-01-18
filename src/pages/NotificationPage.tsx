import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, Spin, Empty, Pagination, Tabs, Button } from "antd";
import {
  getListNotification,
  markAsRead,
  markAllAsRead,
} from "@/apis/notification";
import type { Notification } from "@/apis/notification";
import { NotificationItem } from "@/components/common/shared/NotificationItem";
import { toast } from "react-toastify";

export const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const queryClient = useQueryClient();

  const limit = 20;

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "list", page, filter],
    queryFn: () => {
      const isRead = filter === "all" ? undefined : filter === "read";
      return getListNotification({ page, limit, isRead });
    },
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
        `Đã đánh dấu ${data.data.updatedCount} thông báo là đã đọc`
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
    console.log("Notification clicked:", notification);
  };

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination;
  const unreadCount = data?.data?.unreadCount || 0;

  const tabItems = [
    {
      key: "all",
      label: `Tất cả (${pagination?.total || 0})`,
    },
    {
      key: "unread",
      label: `Chưa đọc (${unreadCount})`,
    },
    {
      key: "read",
      label: "Đã đọc",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Thông báo</h1>
          {unreadCount > 0 && filter !== "read" && (
            <Button
              type="primary"
              onClick={handleMarkAllAsRead}
              loading={markAllAsReadMutation.isPending}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <Tabs
          activeKey={filter}
          onChange={key => {
            setFilter(key as "all" | "unread" | "read");
            setPage(1);
          }}
          items={tabItems}
          className="mb-4"
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12">
            <Empty description="Không có thông báo" />
          </div>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={page}
                  total={pagination.total}
                  pageSize={limit}
                  onChange={setPage}
                  showSizeChanger={false}
                  showTotal={total => `Tổng ${total} thông báo`}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};
