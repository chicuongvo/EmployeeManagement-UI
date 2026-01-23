import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  message,
  Modal,
  Descriptions,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  getAllAttendanceCorrectionRequests,
  approveAttendanceCorrectionRequest,
  rejectAttendanceCorrectionRequest,
  type AttendanceCorrectionRequest,
} from "@/apis/attendance-correction";
import PageTitle from "@/components/common/shared/PageTitle";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";

const ManagementAttendanceCorrectionPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedRequest, setSelectedRequest] =
    useState<AttendanceCorrectionRequest | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-attendance-correction-requests", page, limit],
    queryFn: () =>
      getAllAttendanceCorrectionRequests({
        page,
        limit,
      }),
  });

  const approveMutation = useMutation({
    mutationFn: approveAttendanceCorrectionRequest,
    onSuccess: () => {
      message.success("Đã duyệt đơn xin điểm danh bù!");
      queryClient.invalidateQueries({
        queryKey: ["all-attendance-correction-requests"],
      });
      refetch();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Duyệt đơn thất bại!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAttendanceCorrectionRequest,
    onSuccess: () => {
      message.success("Đã từ chối đơn xin điểm danh bù!");
      queryClient.invalidateQueries({
        queryKey: ["all-attendance-correction-requests"],
      });
      refetch();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Từ chối đơn thất bại!");
    },
  });

  const handleApprove = (id: number) => {
    console.log("handleApprove called with id:", id);
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    console.log("handleReject called with id:", id);
    rejectMutation.mutate(id);
  };

  const handleViewDetail = (record: AttendanceCorrectionRequest) => {
    setSelectedRequest(record);
  };

  const columns: ColumnsType<AttendanceCorrectionRequest> = [
    {
      title: "Mã nhân viên",
      dataIndex: ["employee", "employeeCode"],
      key: "employeeCode",
      width: 120,
    },
    {
      title: "Họ và tên",
      dataIndex: ["employee", "fullName"],
      key: "fullName",
      width: 150,
    },
    {
      title: "Phòng ban",
      dataIndex: ["employee", "department", "name"],
      key: "department",
      width: 150,
    },
    {
      title: "Ngày xin bù",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
      render: (text: string, record: AttendanceCorrectionRequest) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          {text?.substring(0, 30)}
          {text?.length > 30 ? "..." : ""}
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        let color = "gold";
        let text = "Chờ duyệt";

        if (status === "APPROVED") {
          color = "green";
          text = "Đã duyệt";
        } else if (status === "NOT_APPROVED") {
          color = "red";
          text = "Từ chối";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record: AttendanceCorrectionRequest) => {
        if (record.status === "PENDING") {
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleApprove(record.id)}
                loading={approveMutation.isPending}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleReject(record.id)}
                loading={rejectMutation.isPending}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return (
          <Tag color={record.status === "APPROVED" ? "green" : "red"}>
            {record.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
          </Tag>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: "Quản lý nhân sự" },
            { title: "Quản lý đơn xin điểm danh bù" },
          ],
        },
      }}
      title={<PageTitle title="Quản lý đơn xin điểm danh bù" />}
    >
      <Card>
        <Table
          columns={columns}
          dataSource={data?.data.data || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.data.pagination.total || 0,
            onChange: (newPage) => setPage(newPage),
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} đơn`,
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title="Chi tiết đơn xin điểm danh bù"
        open={!!selectedRequest}
        onCancel={() => setSelectedRequest(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedRequest(null)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedRequest && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã nhân viên">
              {selectedRequest.employee.employeeCode}
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              {selectedRequest.employee.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRequest.employee.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng ban">
              {selectedRequest.employee.department?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày xin bù">
              {dayjs(selectedRequest.requestDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {selectedRequest.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  selectedRequest.status === "APPROVED"
                    ? "green"
                    : selectedRequest.status === "NOT_APPROVED"
                      ? "red"
                      : "gold"
                }
              >
                {selectedRequest.status === "APPROVED"
                  ? "Đã duyệt"
                  : selectedRequest.status === "NOT_APPROVED"
                    ? "Từ chối"
                    : "Chờ duyệt"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedRequest.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            {selectedRequest.reviewedAt && (
              <Descriptions.Item label="Ngày xét duyệt">
                {dayjs(selectedRequest.reviewedAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ManagementAttendanceCorrectionPage;
