import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Typography,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import * as systemSettingService from "@/services/system-setting";
import type {
  SystemSetting,
  CreateSystemSettingRequest,
} from "@/types/SystemSetting";

const { Title, Text } = Typography;
const { TextArea } = Input;

const SystemSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(
    null
  );

  // Fetch settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: () => systemSettingService.getAllSystemSettings(),
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSystemSettingRequest) =>
      systemSettingService.setSystemSetting(data),
    onSuccess: () => {
      message.success("Setting đã được lưu thành công!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      handleCancel();
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi lưu setting!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      key,
      data,
    }: {
      key: string;
      data: { value: string; description?: string };
    }) => systemSettingService.updateSystemSetting(key, data),
    onSuccess: () => {
      message.success("Setting đã được cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      handleCancel();
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật setting!");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) => systemSettingService.deleteSystemSetting(key),
    onSuccess: () => {
      message.success("Setting đã được xóa thành công!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi xóa setting!");
    },
  });

  // Refresh cache mutation
  const refreshCacheMutation = useMutation({
    mutationFn: () => systemSettingService.refreshSystemSettingsCache(),
    onSuccess: () => {
      message.success("Cache đã được làm mới!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi làm mới cache!");
    },
  });

  // Seed default settings mutation
  const seedMutation = useMutation({
    mutationFn: () => systemSettingService.seedDefaultSystemSettings(),
    onSuccess: () => {
      message.success("Default settings đã được tạo!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi tạo default settings!");
    },
  });

  const handleCreate = () => {
    setEditingSetting(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsModalVisible(true);
    form.setFieldsValue({
      key: setting.key,
      value: setting.value,
      description: setting.description,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSetting(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingSetting) {
        // Update existing setting
        updateMutation.mutate({
          key: editingSetting.key,
          data: {
            value: values.value,
            description: values.description,
          },
        });
      } else {
        // Create new setting
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleDelete = (key: string) => {
    deleteMutation.mutate(key);
  };

  const getKeyTag = (key: string) => {
    if (key.includes("LEVEL")) return <Tag color="blue">LEVEL</Tag>;
    if (key.includes("SIDEBAR")) return <Tag color="green">SIDEBAR</Tag>;
    if (key.includes("UPLOAD")) return <Tag color="orange">UPLOAD</Tag>;
    if (key.includes("PAGINATION")) return <Tag color="purple">PAGINATION</Tag>;
    return <Tag color="default">OTHER</Tag>;
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 300,
      render: (key: string) => (
        <Space direction="vertical" size={0}>
          <Text strong>{key}</Text>
          {getKeyTag(key)}
        </Space>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 200,
      render: (value: string) => (
        <Text code style={{ wordBreak: "break-all" }}>
          {value}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <Tooltip title={description}>
          <Text ellipsis style={{ maxWidth: 300 }}>
            {description || "-"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: SystemSetting) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa setting này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="mb-2">
              <SettingOutlined className="mr-2" />
              System Settings
            </Title>
            <Text type="secondary">
              Quản lý cấu hình hệ thống và các thiết lập toàn cục
            </Text>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refreshCacheMutation.mutate()}
              loading={refreshCacheMutation.isPending}
            >
              Refresh Cache
            </Button>
            <Button
              onClick={() => seedMutation.mutate()}
              loading={seedMutation.isPending}
            >
              Seed Defaults
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Setting
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={settings}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} settings`,
          }}
        />
      </Card>

      <Modal
        title={editingSetting ? "Edit Setting" : "Create Setting"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="key"
            label="Key"
            rules={[
              { required: true, message: "Please input setting key!" },
              { max: 100, message: "Key must be less than 100 characters!" },
            ]}
          >
            <Input
              placeholder="e.g., MANAGEMENT_LEVEL"
              disabled={!!editingSetting}
            />
          </Form.Item>

          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: "Please input setting value!" }]}
          >
            <Input placeholder="e.g., 2" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Description of this setting..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemSettings;
