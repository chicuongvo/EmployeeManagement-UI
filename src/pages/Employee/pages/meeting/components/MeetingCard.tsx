import { Card, Tag, Button, Tooltip } from "antd";
import { PlayCircleOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { MeetingResponse } from "@/types/Meeting";

interface MeetingCardProps {
  meeting: MeetingResponse;
  isHost: boolean;
  onView?: (meetingId: string) => void;
  onJoin?: (meetingId: string, callId: string) => void;
  showParticipants?: boolean;
  participantsCount?: number;
  totalParticipants?: number;
}

const MeetingCard = ({
  meeting,
  isHost,
  onView,
  onJoin,
  showParticipants = false,
  participantsCount = 0,
  totalParticipants = 0,
}: MeetingCardProps) => {
  const isPast =
    meeting.status === "COMPLETED" || meeting.status === "CANCELLED";

  // Check if meeting time has arrived
  const hasTimeArrived = useMemo(() => {
    if (!meeting.scheduledAt) return true; // If no scheduled time, allow join
    const now = dayjs();
    const scheduledTime = dayjs(meeting.scheduledAt);
    return now.isAfter(scheduledTime) || now.isSame(scheduledTime, "minute");
  }, [meeting.scheduledAt]);

  const canJoin =
    (meeting.status === "SCHEDULED" || meeting.status === "ONGOING") &&
    hasTimeArrived;

  const getStatusTag = () => {
    // Luôn hiển thị số người đã tham gia
    if (showParticipants && totalParticipants > 0) {
      return (
        <Tag color="green">
          {participantsCount}/{totalParticipants} người tham gia
        </Tag>
      );
    }

    // Nếu không có thông tin participants, hiển thị status của meeting
    const statusConfig: Record<string, { color: string; text: string }> = {
      SCHEDULED: { color: "blue", text: "Đã lên lịch" },
      ONGOING: { color: "green", text: "Đang diễn ra" },
      COMPLETED: { color: "default", text: "Đã hoàn thành" },
      CANCELLED: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[meeting.status] || statusConfig.SCHEDULED;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Card
      hoverable
      className="mb-4"
      actions={[
        isPast && onView && (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(meeting.id)}
          >
            Xem chi tiết
          </Button>
        ),
      ].filter(Boolean)}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold mb-0">{meeting.title}</h3>
          {getStatusTag()}
        </div>

        {meeting.scheduledAt && (
          <div className="text-gray-600 mb-2">
            <strong>Thời gian:</strong>{" "}
            {dayjs(meeting.scheduledAt).format("DD/MM/YYYY HH:mm")}
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          {isHost && meeting.createdBy && (
            <div className="text-gray-600 mb-2">
              <strong>Người tạo:</strong> {meeting.createdBy.fullName}
            </div>
          )}

          {!isHost && meeting.createdBy && (
            <div className="text-gray-600 mb-2">
              <strong>Host:</strong> {meeting.createdBy.fullName}
            </div>
          )}
          {showParticipants &&
            totalParticipants > 0 &&
            (meeting.status === "SCHEDULED" || meeting.status === "ONGOING") &&
            onJoin && (
              <div className="flex justify-end gap-2">
                <Tooltip
                  title={
                    !hasTimeArrived && meeting.scheduledAt
                      ? `Cuộc họp bắt đầu lúc ${dayjs(meeting.scheduledAt).format("HH:mm DD/MM/YYYY")}`
                      : undefined
                  }
                >
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => onJoin?.(meeting.id, meeting.callId)}
                    disabled={!canJoin}
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    Tham gia
                  </Button>
                </Tooltip>
              </div>
            )}
        </div>
      </div>
    </Card>
  );
};

export default MeetingCard;
