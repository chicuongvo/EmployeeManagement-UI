import { Form, Input, DatePicker, Modal, message } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNotificationContext } from "../../../NotificationContext";
import type { Notification } from "@/apis/notification/model/Notification";

const { TextArea } = Input;

interface FormCreateUpdateNotificationProps {
  open: boolean;
  onCancel: () => void;
  notification?: Notification | null;
}

const FormCreateUpdateNotification = ({
  open,
  onCancel,
  notification,
}: FormCreateUpdateNotificationProps) => {
  const [form] = Form.useForm();
  const {
    createNotificationMutation,
    updateNotificationMutation,
    setSelectedNotification,
  } = useNotificationContext();

  useEffect(() => {
    if (open && notification) {
      form.setFieldsValue({
        title: notification.title,
        content: notification.content,
        publishedAt: notification.publishedAt
          ? dayjs(notification.publishedAt)
          : null,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, notification, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (notification) {
        // Update mode
        const payload = {
          title: values.title,
          content: values.content,
          publishedAt: values.publishedAt
            ? dayjs(values.publishedAt).format("YYYY-MM-DD")
            : undefined,
        };

        updateNotificationMutation.mutate(
          { id: notification.id, data: payload },
          {
            onSuccess: () => {
              message.success("Cập nhật thông báo thành công!");
              form.resetFields();
              setSelectedNotification(null);
              onCancel();
            },
            onError: () => {
              message.error("Cập nhật thông báo thất bại!");
            },
          },
        );
      } else {
        // Create mode
        const payload = {
          title: values.title,
          content: values.content,
          publishedAt: values.publishedAt
            ? dayjs(values.publishedAt).format("YYYY-MM-DD")
            : undefined,
        };

        createNotificationMutation.mutate(payload, {
          onSuccess: () => {
            message.success("Tạo thông báo thành công!");
            form.resetFields();
            onCancel();
          },
          onError: () => {
            message.error("Tạo thông báo thất bại!");
          },
        });
      }
    } catch {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={notification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={notification ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      width={700}
      confirmLoading={
        createNotificationMutation.isPending ||
        updateNotificationMutation.isPending
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề thông báo" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={5} placeholder="Nhập nội dung thông báo" />
        </Form.Item>

        <Form.Item label="Ngày công bố" name="publishedAt">
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày công bố"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCreateUpdateNotification;
