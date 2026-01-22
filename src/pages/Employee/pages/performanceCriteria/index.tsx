import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Card,
  Typography,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { toast } from "sonner";
import {
  performanceCriteriaService,
  type PerformanceCriteria,
  type PerformanceCriteriaCreate,
} from "@/apis/performance/performanceCriteriaService";
import { PageContainer } from "@ant-design/pro-components";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PerformanceCriteriaPage() {
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<PerformanceCriteria | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const data = await performanceCriteriaService.getAll();
      setCriteria(data);
    } catch (error) {
      console.error("Failed to fetch criteria:", error);
      toast.error("Không thể tải danh sách tiêu chí");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record?: PerformanceCriteria) => {
    if (record) {
      setEditingCriteria(record);
      form.setFieldsValue({
        name: record.name,
        description: record.description,
      });
    } else {
      setEditingCriteria(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCriteria(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: PerformanceCriteriaCreate = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
      };

      if (editingCriteria) {
        await performanceCriteriaService.update(editingCriteria.id, payload);
        toast.success("Cập nhật tiêu chí thành công!");
      } else {
        await performanceCriteriaService.create(payload);
        toast.success("Thêm tiêu chí thành công!");
      }

      handleCloseModal();
      fetchCriteria();
    } catch (error) {
      console.error("Failed to save criteria:", error);
      toast.error("Không thể lưu tiêu chí");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await performanceCriteriaService.delete(id);
      toast.success("Xóa tiêu chí thành công!");
      fetchCriteria();
    } catch (error) {
      console.error("Failed to delete criteria:", error);
      toast.error("Không thể xóa tiêu chí. Tiêu chí có thể đang được sử dụng.");
    }
  };

  const columns: ColumnsType<PerformanceCriteria> = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">{index + 1}</span>
      ),
    },
    {
      title: "Tên tiêu chí",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <StarOutlined className="text-yellow-500" />
          <Text strong>{name}</Text>
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 400,
      render: (description: string) => (
        <Text type="secondary" ellipsis={{ tooltip: description }}>
          {description || "—"}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <Tag color="blue">{dayjs(date).format("DD/MM/YYYY")}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              className="text-blue-500 hover:text-blue-600"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tiêu chí"
            description="Bạn có chắc chắn muốn xóa tiêu chí này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            icon={<ExclamationCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-600"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: "Quản lý tiêu chí đánh giá",
        subTitle: "Thêm, sửa, xóa các tiêu chí đánh giá hiệu suất nhân viên",
      }}
    >
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={5} className="!mb-1">
              Danh sách tiêu chí ({criteria.length})
            </Title>
            <Text type="secondary">
              Các tiêu chí được sử dụng để đánh giá hiệu suất làm việc của nhân viên
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm tiêu chí
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={criteria}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tiêu chí`,
          }}
          locale={{
            emptyText: "Chưa có tiêu chí nào",
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <span>{editingCriteria ? "Chỉnh sửa tiêu chí" : "Thêm tiêu chí mới"}</span>
          </div>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okText={editingCriteria ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên tiêu chí"
            rules={[
              { required: true, message: "Vui lòng nhập tên tiêu chí" },
              { min: 2, message: "Tên tiêu chí phải có ít nhất 2 ký tự" },
              { max: 100, message: "Tên tiêu chí không được quá 100 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Kỹ năng giao tiếp" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: "Mô tả không được quá 500 ký tự" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về tiêu chí đánh giá..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
