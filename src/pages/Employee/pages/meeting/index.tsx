import { PageContainer } from "@ant-design/pro-components";
import { useState, useEffect } from "react";
import { Button, Card, Form, Input, DatePicker, Modal, List, Tag, Space, message } from "antd";
import { PlusOutlined, PlayCircleOutlined, VideoCameraOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { createMeeting, getAllMeetings, updateMeeting } from "@/api/meeting.api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { MeetingResponse } from "@/types/Meeting";

const MeetingPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch meetings from API
  const { data: meetingsData, refetch } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      try {
        const response = await getAllMeetings({});
        if (response && typeof response === "object" && "data" in response) {
          return response.data || [];
        }
        return [];
      } catch (error: any) {
        // If API doesn't exist yet, return empty array
        if (error.response?.status === 404) {
          return [];
        }
        console.error("Error fetching meetings:", error);
        return [];
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds to get updated status
  });

  const meetings = meetingsData || [];

  const handleCreateMeeting = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const meetingData = {
        title: values.title,
        scheduledAt: values.scheduledAt ? dayjs(values.scheduledAt).toISOString() : undefined,
      };

      await createMeeting(meetingData);
      
      form.resetFields();
      setIsModalVisible(false);
      message.success("Tạo cuộc họp thành công!");
      refetch();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(
        error.response?.data?.message || "Không thể tạo cuộc họp. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingId: string, callId: string, status: string) => {
    try {
      // Don't allow joining if meeting is COMPLETED or CANCELLED
      if (status === "COMPLETED" || status === "CANCELLED") {
        message.warning("Cuộc họp đã kết thúc, không thể tham gia.");
        return;
      }

      setLoading(true);
      // Update meeting status to ONGOING when joining
      try {
        await updateMeeting(meetingId, { status: "ONGOING" });
        refetch();
      } catch (error) {
        console.error("Error updating meeting status:", error);
        // Continue even if update fails
      }
      // Navigate to video call with callId - anyone can join
      navigate(`/employee/video-call?callId=${callId}&meetingId=${meetingId}`);
    } catch (error: any) {
      message.error("Không thể tham gia cuộc họp. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      SCHEDULED: { color: "blue", text: "Đã lên lịch" },
      ONGOING: { color: "green", text: "Đang diễn ra" },
      COMPLETED: { color: "default", text: "Đã hoàn thành" },
      CANCELLED: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[status] || statusConfig.SCHEDULED;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Master list",
            },
            {
              title: "Cuộc họp",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý cuộc họp" />}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Create Meeting Button */}
        <Card>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Tạo cuộc họp mới
          </Button>
        </Card>

        {/* Meetings List */}
        <Card title={<><VideoCameraOutlined /> Danh sách cuộc họp</>}>
          <List
            itemLayout="horizontal"
            dataSource={meetings}
            locale={{ emptyText: "Chưa có cuộc họp nào" }}
            renderItem={(meeting) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleJoinMeeting(meeting.id, meeting.callId, meeting.status)}
                    loading={loading}
                    disabled={meeting.status === "COMPLETED" || meeting.status === "CANCELLED"}
                  >
                    {meeting.status === "COMPLETED" || meeting.status === "CANCELLED"
                      ? "Đã kết thúc"
                      : "Tham gia"}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {meeting.title}
                      {getStatusTag(meeting.status)}
                    </Space>
                  }
                  description={
                    <div style={{ color: "#888" }}>
                      {meeting.scheduledAt && (
                        <div>
                          Thời gian: {dayjs(meeting.scheduledAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      )}
                      {meeting.createdBy && (
                        <div>Người tạo: {meeting.createdBy.fullName}</div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>

      {/* Create Meeting Modal */}
      <Modal
        title={<span className="text-lg font-semibold">Tạo cuộc họp mới</span>}
        open={isModalVisible}
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(false);
        }}
        onOk={handleCreateMeeting}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề cuộc họp" />
          </Form.Item>

          <Form.Item
            name="scheduledAt"
            label="Thời gian lên lịch"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
              placeholder="Chọn thời gian"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MeetingPage;
