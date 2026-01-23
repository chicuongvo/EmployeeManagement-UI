import { Form, Input, DatePicker, Modal, message } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import SelectListLeaveType from "@/components/common/form/SelectListLeaveType";
import SelectListLeaveOption from "@/components/common/form/SelectListLeaveOption";
import SelectLeaveApplicationStatus from "@/components/common/form/SelectLeaveApplicationStatus";
import { useMyLeaveApplicationContext } from "../MyLeaveApplicationContext";
import type { LeaveApplication } from "@/apis/leave-application/model/LeaveApplication";

const { TextArea } = Input;

interface FormCreateUpdateLeaveApplicationProps {
  open: boolean;
  onCancel: () => void;
  leaveApplication?: LeaveApplication | null;
}

const FormCreateUpdateLeaveApplication = ({
  open,
  onCancel,
  leaveApplication,
}: FormCreateUpdateLeaveApplicationProps) => {
  const [form] = Form.useForm();
  const {
    createLeaveApplicationMutation,
    updateLeaveApplicationMutation,
    setSelectedLeaveApplication,
    currentUserEmployeeId,
  } = useMyLeaveApplicationContext();

  useEffect(() => {
    if (open && leaveApplication) {
      form.setFieldsValue({
        leaveDate: leaveApplication.leaveDate ? dayjs(leaveApplication.leaveDate) : null,
        reason: leaveApplication.reason,
        leaveTypeId: leaveApplication.leaveTypeId,
        leaveOption: leaveApplication.leaveOption,
        status: leaveApplication.status,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, leaveApplication, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (leaveApplication) {
        // Update mode
        const payload = {
          leaveDate: values.leaveDate
            ? dayjs(values.leaveDate).format("YYYY-MM-DD")
            : undefined,
          reason: values.reason,
          leaveTypeId: values.leaveTypeId,
          leaveOption: values.leaveOption,
          status: values.status,
        };

        updateLeaveApplicationMutation.mutate(
          { id: leaveApplication.id, data: payload },
          {
            onSuccess: () => {
              message.success("Cập nhật đơn nghỉ phép thành công!");
              form.resetFields();
              setSelectedLeaveApplication(null);
            },
            onError: () => {
              message.error("Cập nhật đơn nghỉ phép thất bại!");
            },
          }
        );
      } else {
        // Create mode - always use current user's employeeId
        if (!currentUserEmployeeId) {
          message.error("Không thể xác định thông tin nhân viên!");
          return;
        }

        const payload = {
          leaveDate: dayjs(values.leaveDate).format("YYYY-MM-DD"),
          reason: values.reason,
          employeeId: currentUserEmployeeId,
          leaveTypeId: values.leaveTypeId,
          leaveOption: values.leaveOption,
        };

        createLeaveApplicationMutation.mutate(payload, {
          onSuccess: () => {
            message.success("Tạo đơn nghỉ phép thành công!");
            form.resetFields();
          },
          onError: () => {
            message.error("Tạo đơn nghỉ phép thất bại!");
          },
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedLeaveApplication(null);
    onCancel();
  };

  return (
    <Modal
      title={
        leaveApplication
          ? "Cập nhật đơn nghỉ phép"
          : "Tạo đơn nghỉ phép mới"
      }
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={leaveApplication ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      width={700}
      confirmLoading={
        createLeaveApplicationMutation.isPending ||
        updateLeaveApplicationMutation.isPending
      }
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Loại nghỉ phép"
            name="leaveTypeId"
            rules={[
              { required: true, message: "Vui lòng chọn loại nghỉ phép!" },
            ]}
          >
            <SelectListLeaveType placeholder="Chọn loại nghỉ phép" />
          </Form.Item>

          <Form.Item
            label="Ngày nghỉ"
            name="leaveDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày nghỉ!" },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày nghỉ"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Buổi nghỉ phép"
            name="leaveOption"
            rules={[
              { required: true, message: "Vui lòng chọn buổi nghỉ phép!" },
            ]}
          >
            <SelectListLeaveOption placeholder="Chọn buổi nghỉ phép" />
          </Form.Item>
        </div>

        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập lý do nghỉ phép..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* {leaveApplication && (
          <Form.Item label="Trạng thái" name="status">
            <SelectLeaveApplicationStatus placeholder="Chọn trạng thái" />
          </Form.Item>
        )} */}
      </Form>
    </Modal>
  );
};

export default FormCreateUpdateLeaveApplication;
