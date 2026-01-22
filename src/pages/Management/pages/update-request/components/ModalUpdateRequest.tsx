import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Tag,
  Descriptions,
  message,
} from "antd";
import { useUpdateRequestContext } from "../UpdateRequestContext";
import type { UpdateRequestResponse } from "@/types/UpdateRequest";
import type {
  CreateUpdateRequestRequest,
  UpdateUpdateRequestRequest,
} from "@/types/UpdateRequest";
import { useUser } from "@/hooks/useUser";
import dayjs from "dayjs";

const { TextArea } = Input;

interface ModalUpdateRequestProps {
  isMyRequests?: boolean;
}

const ModalUpdateRequest = ({ isMyRequests = false }: ModalUpdateRequestProps) => {
  const {
    popupUpdateRequest,
    setPopupUpdateRequest,
    selectedUpdateRequest,
    setSelectedUpdateRequest,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleReview,
  } = useUpdateRequestContext();
  const { userProfile } = useUser();

  const [form] = Form.useForm();
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (popupUpdateRequest && selectedUpdateRequest) {
      setMode("view");
      form.setFieldsValue({
        content: selectedUpdateRequest.content,
        requestedById: selectedUpdateRequest.requestedById,
      });
    } else if (popupUpdateRequest && !selectedUpdateRequest) {
      setMode("create");
      form.resetFields();
      // Auto-fill requestedById if user is logged in
      if (userProfile?.id) {
        form.setFieldsValue({
          requestedById: userProfile.id,
        });
      }
    } else {
      setMode("view");
      form.resetFields();
    }
  }, [popupUpdateRequest, selectedUpdateRequest, form]);

  const handleCancel = () => {
    setPopupUpdateRequest(false);
    setSelectedUpdateRequest(null);
    form.resetFields();
    setMode("view");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      if (mode === "create") {
        const createData: CreateUpdateRequestRequest = {
          content: values.content,
          requestedById: values.requestedById,
        };
        await handleCreate(createData);
        handleCancel();
      } else if (mode === "edit" && selectedUpdateRequest) {
        const updateData: UpdateUpdateRequestRequest = {
          content: values.content,
        };
        await handleUpdate(selectedUpdateRequest.id, updateData);
        handleCancel();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUpdateRequest) return;
    setIsSubmitting(true);
    try {
      await handleDelete(selectedUpdateRequest.id);
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewConfirm = async (status: "APPROVED" | "NOT_APPROVED") => {
    if (!selectedUpdateRequest) return;
    setIsSubmitting(true);
    try {
      await handleReview(selectedUpdateRequest.id, status);
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      PENDING: { color: "warning", text: "Pending" },
      APPROVED: { color: "success", text: "Approved" },
      NOT_APPROVED: { color: "error", text: "Not Approved" },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const title =
    mode === "create"
      ? "Tạo yêu cầu cập nhật mới"
      : mode === "edit"
      ? "Chỉnh sửa yêu cầu cập nhật"
      : "Chi tiết yêu cầu cập nhật";

  return (
    <Modal
      title={title}
      open={popupUpdateRequest}
      onCancel={handleCancel}
      width={mode === "view" ? 700 : 600}
      footer={
        mode === "view" ? (
          <Space>
            {!isMyRequests && selectedUpdateRequest?.status === "PENDING" && (
              <>
                <Button
                  type="primary"
                  onClick={() => handleReviewConfirm("APPROVED")}
                  loading={isSubmitting}
                  style={{ background: "#10b981" }}
                >
                  Phê duyệt
                </Button>
                <Button
                  danger
                  onClick={() => handleReviewConfirm("NOT_APPROVED")}
                  loading={isSubmitting}
                >
                  Từ chối
                </Button>
              </>
            )}
          </Space>
        ) : (
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              {mode === "create" ? "Gửi đơn xin" : "Cập nhật"}
            </Button>
          </Space>
        )
      }
    >
      {mode === "view" && selectedUpdateRequest ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">
            {selectedUpdateRequest.id}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(selectedUpdateRequest.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung đơn xin">
            <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {selectedUpdateRequest.content}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Người yêu cầu">
            <div>
              <div>{selectedUpdateRequest.requestedBy?.fullName || "-"}</div>
              {selectedUpdateRequest.requestedBy?.email && (
                <div className="text-sm text-gray-500">
                  {selectedUpdateRequest.requestedBy.email}
                </div>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Người xem xét">
            <div>
              <div>
                {selectedUpdateRequest.reviewedBy?.fullName || "Chưa gán"}
              </div>
              {selectedUpdateRequest.reviewedBy?.email && (
                <div className="text-sm text-gray-500">
                  {selectedUpdateRequest.reviewedBy.email}
                </div>
              )}
            </div>
          </Descriptions.Item>
          {selectedUpdateRequest.createdAt && (
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedUpdateRequest.createdAt).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
          )}
          {selectedUpdateRequest.updatedAt && (
            <Descriptions.Item label="Ngày cập nhật">
              {dayjs(selectedUpdateRequest.updatedAt).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="content"
            label="Nội dung đơn xin"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung đơn xin" },
            ]}
          >
            <TextArea
              rows={8}
              placeholder="Nhập nội dung đơn xin thay đổi..."
              disabled={isSubmitting}
            />
          </Form.Item>

          {mode === "create" && (
            <Form.Item
              name="requestedById"
              label="ID Người yêu cầu"
              rules={[
                { required: true, message: "Vui lòng nhập ID người yêu cầu" },
              ]}
              hidden={!!userProfile?.id}
            >
              <Input
                type="number"
                placeholder="Nhập ID người yêu cầu"
                disabled={isSubmitting || !!userProfile?.id}
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default ModalUpdateRequest;
