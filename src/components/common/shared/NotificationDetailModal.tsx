import { Modal, Typography, Tag, Divider } from "antd";
import dayjs from "dayjs";
import type { Notification } from "@/apis/notification/model/Notification";
import { formatDistanceToNow } from "date-fns";

const { Title, Paragraph } = Typography;

interface NotificationDetailModalProps {
  open: boolean;
  notification: Notification | null;
  onClose: () => void;
}

export const NotificationDetailModal = ({
  open,
  notification,
  onClose,
}: NotificationDetailModalProps) => {
  if (!notification) return null;

  const timeAgo = formatDistanceToNow(new Date(notification.publishedAt), {
    addSuffix: true,
  });

  const formattedDate = dayjs(notification.publishedAt).format(
    "DD/MM/YYYY HH:mm"
  );

  return (
    <Modal
      title="Chi tiết thông báo"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Title level={4} className="mb-0">
              {notification.title}
            </Title>
            <Tag color={notification.isRead ? "green" : "orange"}>
              {notification.isRead ? "Đã đọc" : "Chưa đọc"}
            </Tag>
          </div>
        </div>

        <Divider className="my-3" />

        <div>
          <Paragraph className="text-gray-700 whitespace-pre-wrap">
            {notification.content}
          </Paragraph>
        </div>

        <Divider className="my-3" />

        <div className="text-sm text-gray-500 space-y-1">
          {notification.creatorName && (
            <div>
              <span className="font-medium">Người tạo:</span>{" "}
              {notification.creatorName}
            </div>
          )}
          <div>
            <span className="font-medium">Ngày công bố:</span> {formattedDate}{" "}
            <span className="text-gray-400">({timeAgo})</span>
          </div>
          {notification.readAt && (
            <div>
              <span className="font-medium">Đã đọc lúc:</span>{" "}
              {dayjs(notification.readAt).format("DD/MM/YYYY HH:mm")}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
