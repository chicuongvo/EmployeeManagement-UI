import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Form,
  DatePicker,
  Input,
  Button,
  Table,
  Tag,
  message,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  createAttendanceCorrectionRequest,
  getMyAttendanceCorrectionRequests,
  type AttendanceCorrectionRequest,
} from "@/apis/attendance-correction";
import PageTitle from "@/components/common/shared/PageTitle";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import PrimaryButton from "@/components/common/button/PrimaryButton";

const { TextArea } = Input;

const AttendanceCorrectionPage = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-attendance-correction-requests", page, limit],
    queryFn: () => getMyAttendanceCorrectionRequests({ page, limit }),
  });

  const createMutation = useMutation({
    mutationFn: createAttendanceCorrectionRequest,
    onSuccess: () => {
      message.success("Tạo đơn xin điểm danh bù thành công!");
      form.resetFields();
      setIsModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["my-attendance-correction-requests"],
      });
      refetch();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Tạo đơn thất bại!");
    },
  });

  const handleOpenModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    createMutation.mutate({
      requestDate: values.requestDate.format("YYYY-MM-DD"),
      reason: values.reason,
    });
  };

  const columns: ColumnsType<AttendanceCorrectionRequest> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Ngày xin điểm danh bù",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày chấm công",
      key: "attendanceDate",
      render: (record) => {
        const detail = record.attendanceReportDetail?.attendanceReport;
        if (!detail) return "-";
        return `${detail.day}/${detail.month}/${detail.year}`;
      },
    },
    // {
    //   title: "Giờ check-in",
    //   key: "checkinTime",
    //   render: (record) => {
    //     const time = record.attendanceReportDetail?.checkinTime;
    //     if (!time) return "-";

    //     // Convert to string if it's a Date object
    //     let timeStr: string;
    //     if (typeof time === "string") {
    //       timeStr = time;
    //     } else {
    //       const date = new Date(time);
    //       timeStr = `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
    //     }

    //     // Convert UTC to Vietnam time (UTC+7)
    //     const [hours, minutes] = timeStr.split(":").map(Number);
    //     const vietnamHours = (hours + 7) % 24;
    //     return `${vietnamHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    //   },
    // },
    // {
    //   title: "Giờ check-out",
    //   key: "checkoutTime",
    //   render: (record) => {
    //     const time = record.attendanceReportDetail?.checkoutTime;
    //     if (!time) return "-";

    //     // Convert to string if it's a Date object
    //     let timeStr: string;
    //     if (typeof time === "string") {
    //       timeStr = time;
    //     } else {
    //       const date = new Date(time);
    //       timeStr = `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
    //     }

    //     // Convert UTC to Vietnam time (UTC+7)
    //     const [hours, minutes] = timeStr.split(":").map(Number);
    //     const vietnamHours = (hours + 7) % 24;
    //     return `${vietnamHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    //   },
    // },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          PENDING: { color: "gold", text: "Chờ duyệt" },
          APPROVED: { color: "green", text: "Đã duyệt" },
          NOT_APPROVED: { color: "red", text: "Từ chối" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: "Thông tin cá nhân" },
            { title: "Đơn xin điểm danh bù" },
          ],
        },
      }}
      title={<PageTitle title="Đơn xin điểm danh bù" />}
      extra={[
        <PrimaryButton
          key="create"
          icon={<PlusOutlined className="icon-hover-green" />}
          onClick={handleOpenModal}
          color="green"
        >
          Tạo đơn mới
        </PrimaryButton>,
      ]}
    >
      <Card title="Danh sách đơn xin điểm danh bù của tôi">
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
        />
      </Card>

      <Modal
        title="Tạo đơn xin điểm danh bù"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-4"
        >
          <Form.Item
            name="requestDate"
            label="Ngày xin điểm danh bù"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              disabledDate={(current) => {
                // Không cho phép chọn ngày tương lai
                return current && current > dayjs().endOf("day");
              }}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do xin điểm danh bù..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={handleCloseModal} className="mr-2">
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending}
            >
              Gửi đơn
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AttendanceCorrectionPage;
