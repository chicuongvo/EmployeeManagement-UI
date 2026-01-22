import { PageContainer } from "@ant-design/pro-components";
import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  Empty,
  Space,
  Typography,
  List,
  Avatar,
  Tooltip,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getMeetingById, updateParticipantStatus } from "@/api/meeting.api";
import PageTitle from "@/components/common/shared/PageTitle";
import { useUser } from "@/hooks/useUser";
const { Paragraph, Text } = Typography;

const ManagementMeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useUser();

  // Fetch meeting data
  const {
    data: meeting,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["management-meeting", id],
    queryFn: async () => {
      if (!id) throw new Error("Meeting ID is required");
      return await getMeetingById(id);
    },
    enabled: !!id,
    refetchInterval: 5000,
  });

  // Management users are always hosts
  const isHost = true;

  // Calculate participant statistics
  const participantStats = useMemo(() => {
    if (!meeting?.participants) {
      return { joined: 0, notJoined: 0, total: 0 };
    }
    const joined = meeting.participants.filter(
      (p) => p.status === "ACCEPTED",
    ).length;
    const notJoined = meeting.participants.filter(
      (p) => p.status === "PENDING" || p.status === "DECLINED",
    ).length;
    return {
      joined,
      notJoined,
      total: meeting.participants.length,
    };
  }, [meeting?.participants]);

  // Check current user's participant status
  const currentUserParticipant = useMemo(() => {
    if (!meeting?.participants || !userProfile?.id) return null;
    return meeting.participants.find((p) => p.employeeId === userProfile.id);
  }, [meeting?.participants, userProfile?.id]);

  // Check if meeting time has arrived
  const hasTimeArrived = useMemo(() => {
    if (!meeting?.scheduledAt) return true;
    const now = dayjs();
    const scheduledTime = dayjs(meeting.scheduledAt);
    return now.isAfter(scheduledTime) || now.isSame(scheduledTime, "minute");
  }, [meeting?.scheduledAt]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!meeting) {
    return (
      <PageContainer>
        <Empty description="Không tìm thấy cuộc họp" />
      </PageContainer>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: "blue",
      ONGOING: "green",
      COMPLETED: "default",
      CANCELLED: "red",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      SCHEDULED: "Đã lên lịch",
      ONGOING: "Đang diễn ra",
      COMPLETED: "Đã hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return texts[status] || status;
  };

  const canJoin =
    (meeting.status === "SCHEDULED" || meeting.status === "ONGOING") &&
    hasTimeArrived;

  const handleJoinMeeting = async () => {
    if (!meeting || !userProfile?.id) return;

    if (!hasTimeArrived && meeting.scheduledAt) {
      message.warning(
        `Cuộc họp chưa đến giờ. Thời gian bắt đầu: ${dayjs(meeting.scheduledAt).format("HH:mm DD/MM/YYYY")}`,
      );
      return;
    }

    try {
      // Update participant status to ACCEPTED when joining
      try {
        console.log("Management - Updating participant status:", {
          meetingId: meeting.id,
          userId: userProfile.id,
        });
        await updateParticipantStatus(meeting.id, userProfile.id, "ACCEPTED");
        console.log("Management - Participant status updated successfully");
        refetch();
      } catch (error) {
        console.error("Management - Error updating participant status:", error);
      }

      // Navigate to management video call
      navigate(
        `/management/video-call?callId=${meeting.callId}&meetingId=${meeting.id}`,
      );
    } catch (error) {
      console.error("Management - Error joining meeting:", error);
    }
  };

  const getParticipantStatusIcon = (status: string) => {
    if (status === "ACCEPTED") {
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    }
    return <CloseCircleOutlined style={{ color: "#8c8c8c" }} />;
  };

  const getParticipantStatusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Đã tham gia";
      case "DECLINED":
      case "PENDING":
        return "Không tham gia";
      default:
        return "Không tham gia";
    }
  };

  const getParticipantStatusTag = (status: string) => {
    const isJoined = status === "ACCEPTED";
    return (
      <Tag
        color={isJoined ? "success" : "default"}
        icon={getParticipantStatusIcon(status)}
      >
        {getParticipantStatusText(status)}
      </Tag>
    );
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: "Quản lý nhân sự" },
            { title: "Cuộc họp" },
            { title: meeting.title },
          ],
        },
      }}
      title={<PageTitle title={meeting.title} />}
      extra={
        <Tag color="orange" style={{ fontSize: "14px", padding: "4px 12px" }}>
          Host
        </Tag>
      }
    >
      <div className="space-y-6">
        <Card>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tiêu đề">
              <Text strong>{meeting.title}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(meeting.status)}>
                {getStatusText(meeting.status)}
              </Tag>
            </Descriptions.Item>
            {meeting.scheduledAt && (
              <Descriptions.Item label="Thời gian">
                <Space>
                  <CalendarOutlined />
                  {dayjs(meeting.scheduledAt).format("DD/MM/YYYY HH:mm")}
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Người tạo">
              <Space>
                <UserOutlined />
                {meeting.createdBy?.fullName || "N/A"}
              </Space>
            </Descriptions.Item>
            {meeting.participants && meeting.participants.length > 0 && (
              <>
                <Descriptions.Item label="Tổng số người được mời">
                  {participantStats.total}
                </Descriptions.Item>
                <Descriptions.Item label="Số người đã tham gia">
                  <Tag color="success">{participantStats.joined}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Số người không tham gia">
                  <Tag color="default">{participantStats.notJoined}</Tag>
                </Descriptions.Item>
              </>
            )}
            {meeting.description && (
              <Descriptions.Item label="Mô tả / Agenda">
                <Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {meeting.description}
                </Paragraph>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Participants List */}
        {meeting.participants && meeting.participants.length > 0 && (
          <Card title="Danh sách người tham gia">
            <List
              dataSource={meeting.participants}
              renderItem={(participant) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />}>
                        {participant.employee.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{participant.employee.fullName}</Text>
                        <Text type="secondary">
                          #{participant.employee.employeeCode}
                        </Text>
                      </Space>
                    }
                    description={participant.employee.email}
                  />
                  <div>{getParticipantStatusTag(participant.status)}</div>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Actions */}
        <Card title="Thao tác">
          <Space direction="vertical" size="middle" className="w-full">
            <Tooltip
              title={
                !hasTimeArrived && meeting.scheduledAt
                  ? `Cuộc họp chưa đến giờ. Thời gian bắt đầu: ${dayjs(meeting.scheduledAt).format("HH:mm DD/MM/YYYY")}`
                  : undefined
              }
            >
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                size="large"
                onClick={handleJoinMeeting}
                block
                disabled={!canJoin}
              >
                Bắt đầu cuộc họp
              </Button>
            </Tooltip>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/management/meetings/past")}
            >
              Quay lại danh sách
            </Button>
          </Space>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ManagementMeetingDetailPage;
