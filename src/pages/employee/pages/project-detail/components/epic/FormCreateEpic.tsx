import { Modal, Form, Input, DatePicker, message } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  createEpic,
  updateEpic,
  setEpicExecutors,
  type Epic,
  EpicStatus,
  EpicPriority,
} from "@/apis/epic";
import { useProjectDetail } from "../../ProjectDetailContext";
import SelectEpicStatus from "@/components/common/form/SelectEpicStatus";
import SelectEpicPriority from "@/components/common/form/SelectEpicPriority";
import SelectProjectMembers from "@/components/common/form/SelectProjectMembers";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface FormCreateEpicProps {
  open: boolean;
  onCancel: () => void;
  epic?: Epic | null;
}

const FormCreateEpic = ({ open, onCancel, epic }: FormCreateEpicProps) => {
  const [form] = Form.useForm();
  const {
    projectId,
    refetchEpics,
    selectedEpic,
    setSelectedEpic,
    members,
    isLoadingMembers,
  } = useProjectDetail();

  const currentEpic = epic || selectedEpic;

  const createMutation = useMutation({
    mutationFn: createEpic(projectId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: any }) =>
      updateEpic(data.id)(data.payload),
  });

  const setExecutorsMutation = useMutation({
    mutationFn: (data: { epicId: number; employeeIds: number[] }) =>
      setEpicExecutors(data.epicId)(data.employeeIds),
  });

  useEffect(() => {
    if (open && currentEpic) {
      form.setFieldsValue({
        name: currentEpic.name,
        description: currentEpic.description,
        status: currentEpic.status,
        priority: currentEpic.priority,
        dateRange:
          currentEpic.startDate && currentEpic.endDate
            ? [dayjs(currentEpic.startDate), dayjs(currentEpic.endDate)]
            : undefined,
        employeeIds: currentEpic.executors?.map((e) => e.employeeId),
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        status: EpicStatus.TODO,
        priority: EpicPriority.MEDIUM,
      });
    }
  }, [open, currentEpic, form]);

  const handleClose = () => {
    form.resetFields();
    setSelectedEpic(null);
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const epicPayload = {
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        startDate: values.dateRange?.[0]?.toISOString(),
        endDate: values.dateRange?.[1]?.toISOString(),
      };

      const employeeIds = values.employeeIds || [];

      if (currentEpic) {
        // Update epic basic fields
        await updateMutation.mutateAsync({
          id: currentEpic.id,
          payload: epicPayload,
        });

        // Then set executors if they changed
        if (employeeIds.length > 0 || currentEpic.executors?.length) {
          await setExecutorsMutation.mutateAsync({
            epicId: currentEpic.id,
            employeeIds,
          });
        }

        message.success("Cập nhật epic thành công!");
        refetchEpics();
        handleClose();
      } else {
        // Create epic first
        const newEpic = await createMutation.mutateAsync(epicPayload);

        // Then set executors if any
        if (employeeIds.length > 0 && newEpic.data?.id) {
          await setExecutorsMutation.mutateAsync({
            epicId: newEpic.data.id,
            employeeIds,
          });
        }

        message.success("Tạo epic thành công!");
        refetchEpics();
        handleClose();
      }
    } catch (error) {
      console.error("Operation failed:", error);
      message.error(
        currentEpic ? "Cập nhật epic thất bại!" : "Tạo epic thất bại!",
      );
    }
  };

  return (
    <Modal
      title={currentEpic ? "Cập nhật Epic" : "Tạo Epic Mới"}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={
        createMutation.isPending ||
        updateMutation.isPending ||
        setExecutorsMutation.isPending
      }
      width={600}
      okText={currentEpic ? "Cập nhật" : "Tạo Epic"}
      cancelText="Hủy bỏ"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: EpicStatus.TODO,
          priority: EpicPriority.MEDIUM,
        }}
      >
        <Form.Item
          name="name"
          label="Tên Epic"
          rules={[{ required: true, message: "Vui lòng nhập tên epic!" }]}
        >
          <Input placeholder="Nhập tên epic..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Mô tả chi tiết..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <SelectEpicStatus placeholder="Chọn trạng thái" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
            rules={[
              { required: true, message: "Vui lòng chọn mức độ ưu tiên!" },
            ]}
          >
            <SelectEpicPriority placeholder="Chọn mức độ ưu tiên" />
          </Form.Item>
        </div>

        <Form.Item name="dateRange" label="Thời gian">
          <RangePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          />
        </Form.Item>

        <Form.Item name="employeeIds" label="Người thực hiện">
          <SelectProjectMembers
            mode="multiple"
            members={members}
            loading={isLoadingMembers}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCreateEpic;
