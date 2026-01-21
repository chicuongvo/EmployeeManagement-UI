import { useState } from "react";
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  message,
  Popconfirm,
  Typography,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import {
  getAllFixedHolidays,
  createFixedHoliday,
  updateFixedHoliday,
  deleteFixedHoliday,
  getAllAnnualHolidays,
  createAnnualHoliday,
  updateAnnualHoliday,
  deleteAnnualHoliday,
  type FixedHoliday,
  type AnnualHoliday,
  type CreateFixedHolidayDto,
  type CreateAnnualHolidayDto,
} from "@/apis/holiday";

const { Title } = Typography;
const { TextArea } = Input;

const HolidayManagementPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"fixed" | "annual">("fixed");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<
    FixedHoliday | AnnualHoliday | null
  >(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [form] = Form.useForm();

  // Fetch fixed holidays
  const { data: fixedHolidays, isLoading: isLoadingFixed } = useQuery({
    queryKey: ["fixedHolidays"],
    queryFn: getAllFixedHolidays,
  });

  // Fetch annual holidays
  const { data: annualHolidays, isLoading: isLoadingAnnual } = useQuery({
    queryKey: ["annualHolidays", selectedYear],
    queryFn: () => getAllAnnualHolidays(selectedYear),
  });

  // Create fixed holiday mutation
  const createFixedMutation = useMutation({
    mutationFn: createFixedHoliday,
    onSuccess: () => {
      message.success("Tạo ngày nghỉ lễ cố định thành công");
      queryClient.invalidateQueries({ queryKey: ["fixedHolidays"] });
      handleCloseModal();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Update fixed holiday mutation
  const updateFixedMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateFixedHoliday(id, data),
    onSuccess: () => {
      message.success("Cập nhật ngày nghỉ lễ cố định thành công");
      queryClient.invalidateQueries({ queryKey: ["fixedHolidays"] });
      handleCloseModal();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Delete fixed holiday mutation
  const deleteFixedMutation = useMutation({
    mutationFn: deleteFixedHoliday,
    onSuccess: () => {
      message.success("Xóa ngày nghỉ lễ cố định thành công");
      queryClient.invalidateQueries({ queryKey: ["fixedHolidays"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Create annual holiday mutation
  const createAnnualMutation = useMutation({
    mutationFn: createAnnualHoliday,
    onSuccess: () => {
      message.success("Tạo ngày nghỉ lễ hàng năm thành công");
      queryClient.invalidateQueries({ queryKey: ["annualHolidays"] });
      handleCloseModal();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Update annual holiday mutation
  const updateAnnualMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateAnnualHoliday(id, data),
    onSuccess: () => {
      message.success("Cập nhật ngày nghỉ lễ hàng năm thành công");
      queryClient.invalidateQueries({ queryKey: ["annualHolidays"] });
      handleCloseModal();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Delete annual holiday mutation
  const deleteAnnualMutation = useMutation({
    mutationFn: deleteAnnualHoliday,
    onSuccess: () => {
      message.success("Xóa ngày nghỉ lễ hàng năm thành công");
      queryClient.invalidateQueries({ queryKey: ["annualHolidays"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleOpenModal = (holiday?: FixedHoliday | AnnualHoliday) => {
    setEditingHoliday(holiday || null);
    if (holiday) {
      if (activeTab === "fixed") {
        const fixed = holiday as FixedHoliday;
        form.setFieldsValue({
          name: fixed.name,
          day: fixed.day,
          month: fixed.month,
          description: fixed.description,
        });
      } else {
        const annual = holiday as AnnualHoliday;
        form.setFieldsValue({
          name: annual.name,
          date: dayjs(annual.date),
          description: annual.description,
        });
      }
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHoliday(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (activeTab === "fixed") {
        const data: CreateFixedHolidayDto = {
          name: values.name,
          day: values.day,
          month: values.month,
          description: values.description,
        };

        if (editingHoliday) {
          updateFixedMutation.mutate({ id: editingHoliday.id, data });
        } else {
          createFixedMutation.mutate(data);
        }
      } else {
        const data: CreateAnnualHolidayDto = {
          name: values.name,
          date: values.date.format("YYYY-MM-DD"),
          year: values.date.year(),
          description: values.description,
        };

        if (editingHoliday) {
          updateAnnualMutation.mutate({ id: editingHoliday.id, data });
        } else {
          createAnnualMutation.mutate(data);
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDelete = (id: number) => {
    if (activeTab === "fixed") {
      deleteFixedMutation.mutate(id);
    } else {
      deleteAnnualMutation.mutate(id);
    }
  };

  // Fixed holidays columns
  const fixedColumns: ColumnsType<FixedHoliday> = [
    {
      title: "Tên ngày nghỉ",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Ngày",
      dataIndex: "day",
      key: "day",
      width: 80,
      align: "center",
    },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      width: 80,
      align: "center",
    },
    {
      title: "Ngày trong năm",
      key: "date",
      width: 120,
      render: (_, record) => `${record.day}/${record.month}`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa ngày nghỉ lễ"
            description="Bạn có chắc chắn muốn xóa ngày nghỉ lễ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Annual holidays columns
  const annualColumns: ColumnsType<AnnualHoliday> = [
    {
      title: "Tên ngày nghỉ",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      width: 80,
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa ngày nghỉ lễ"
            description="Bạn có chắc chắn muốn xóa ngày nghỉ lễ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabs = [
    {
      key: "fixed",
      label: (
        <span>
          <CalendarOutlined /> Ngày nghỉ lễ cố định
        </span>
      ),
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Title level={5}>Ngày nghỉ lễ cố định hàng năm</Title>
              <p className="text-gray-500">
                Các ngày nghỉ lễ lặp lại mỗi năm (Tết Dương lịch, Quốc khánh,
                v.v.)
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              Thêm ngày nghỉ lễ
            </Button>
          </div>
          <Table
            columns={fixedColumns}
            dataSource={fixedHolidays}
            loading={isLoadingFixed}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} ngày nghỉ lễ`,
            }}
          />
        </Card>
      ),
    },
    {
      key: "annual",
      label: (
        <span>
          <CalendarOutlined /> Ngày nghỉ lễ hàng năm
        </span>
      ),
      children: (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <Title level={5}>Ngày nghỉ lễ theo năm</Title>
                <p className="text-gray-500">
                  Các ngày nghỉ lễ có thay đổi theo năm âm lịch (Tết Nguyên Đán,
                  Giỗ Tổ, v.v.)
                </p>
              </div>
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                style={{ width: 120 }}
                options={Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return { label: year, value: year };
                })}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              Thêm ngày nghỉ lễ
            </Button>
          </div>
          <Table
            columns={annualColumns}
            dataSource={annualHolidays}
            loading={isLoadingAnnual}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} ngày nghỉ lễ`,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Quản lý ngày nghỉ lễ</Title>
        <p className="text-gray-500">
          Quản lý các ngày nghỉ lễ cố định và ngày nghỉ lễ hàng năm
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "fixed" | "annual")}
        items={tabs}
      />

      {/* Modal for Create/Edit */}
      <Modal
        title={
          editingHoliday
            ? `Sửa ngày nghỉ lễ ${activeTab === "fixed" ? "cố định" : "hàng năm"}`
            : `Thêm ngày nghỉ lễ ${activeTab === "fixed" ? "cố định" : "hàng năm"}`
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        okText={editingHoliday ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={600}
        confirmLoading={
          createFixedMutation.isPending ||
          updateFixedMutation.isPending ||
          createAnnualMutation.isPending ||
          updateAnnualMutation.isPending
        }
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên ngày nghỉ lễ"
            rules={[
              { required: true, message: "Vui lòng nhập tên ngày nghỉ lễ" },
            ]}
          >
            <Input placeholder="VD: Tết Dương lịch, Quốc khánh, ..." />
          </Form.Item>

          {activeTab === "fixed" ? (
            <>
              <Space className="w-full" size="large">
                <Form.Item
                  name="day"
                  label="Ngày"
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                  className="flex-1"
                >
                  <InputNumber
                    min={1}
                    max={31}
                    placeholder="Ngày"
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item
                  name="month"
                  label="Tháng"
                  rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
                  className="flex-1"
                >
                  <InputNumber
                    min={1}
                    max={12}
                    placeholder="Tháng"
                    className="w-full"
                  />
                </Form.Item>
              </Space>
            </>
          ) : (
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                className="w-full"
              />
            </Form.Item>
          )}

          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={4}
              placeholder="Nhập mô tả về ngày nghỉ lễ (không bắt buộc)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HolidayManagementPage;
