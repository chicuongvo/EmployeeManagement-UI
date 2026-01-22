import { Modal, Form, Input, DatePicker, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  createTask,
  updateTask,
  setTaskAssignments,
  type Task,
  TaskStatus,
  TaskPriority,
} from "@/apis/task";
import { useEpicTask } from "../EpicTaskContext";
import SelectTaskStatus from "@/components/common/form/SelectTaskStatus";
import SelectTaskPriority from "@/components/common/form/SelectTaskPriority";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";

const { TextArea } = Input;

interface FormCreateTaskProps {
  open: boolean;
  onCancel: () => void;
  task?: Task | null;
}

const FormCreateTask = ({ open, onCancel, task }: FormCreateTaskProps) => {
  const [form] = Form.useForm();
  const {
    epicId,
    refetchTasks,
    selectedTask,
    setSelectedTask,
    tasks,
    parentTaskId,
    setParentTaskId,
  } = useEpicTask();
  const queryClient = useQueryClient();

  const currentTask = task || selectedTask;
  const [isModalOpen, setIsModalOpen] = useState(open);

  const createMutation = useMutation({
    mutationFn: createTask(epicId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: any }) =>
      updateTask(data.id)(data.payload),
  });

  const setAssignmentsMutation = useMutation({
    mutationFn: (data: { taskId: number; employeeIds: number[] }) =>
      setTaskAssignments(data.taskId)(data.employeeIds),
  });

  useEffect(() => {
    // Open modal when editing a task (selectedTask is set)
    if (currentTask) {
      form.setFieldsValue({
        name: currentTask.name,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        startDate: currentTask.startDate
          ? dayjs(currentTask.startDate)
          : undefined,
        dueDate: currentTask.dueDate ? dayjs(currentTask.dueDate) : undefined,
        parentTaskId: currentTask.parentTaskId,
        employeeIds: currentTask.assignments?.map((a) => a.employeeId),
      });
      setIsModalOpen(true);
    }
    // Open modal when creating a new task (open prop or parentTaskId is set)
    else if (open || parentTaskId !== null) {
      form.resetFields();
      form.setFieldsValue({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        parentTaskId: parentTaskId,
      });
      setIsModalOpen(true);
    }
    // Close modal when everything is cleared
    else if (!open && !currentTask && !parentTaskId) {
      setIsModalOpen(false);
    }
  }, [open, currentTask, form, parentTaskId]);

  const handleClose = () => {
    form.resetFields();
    setSelectedTask(null);
    setParentTaskId(null);
    setIsModalOpen(false);
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const taskPayload = {
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        startDate: values.startDate?.toISOString(),
        dueDate: values.dueDate?.toISOString(),
        // Use parentTaskId from context if creating subtask, otherwise use form value
        parentTaskId: parentTaskId || values.parentTaskId,
      };

      const employeeIds = values.employeeIds || [];

      if (currentTask) {
        // Update task basic fields
        await updateMutation.mutateAsync({
          id: currentTask.id,
          payload: taskPayload,
        });

        // Then set assignments if they changed
        if (employeeIds.length > 0 || currentTask.assignments?.length) {
          await setAssignmentsMutation.mutateAsync({
            taskId: currentTask.id,
            employeeIds,
          });
        }

        message.success("Cập nhật task thành công!");

        // Invalidate queries to refetch
        queryClient.invalidateQueries({ queryKey: ["tasks", epicId] });
        queryClient.invalidateQueries({ queryKey: ["task", currentTask.id] });
        if (currentTask.parentTaskId) {
          queryClient.invalidateQueries({
            queryKey: ["task", currentTask.parentTaskId],
          });
        }

        refetchTasks();
        handleClose();
      } else {
        // Create task first
        const newTask = await createMutation.mutateAsync(taskPayload);

        // Then set assignments if any
        if (employeeIds.length > 0 && newTask.data?.id) {
          await setAssignmentsMutation.mutateAsync({
            taskId: newTask.data.id,
            employeeIds,
          });
        }

        message.success("Tạo task thành công!");

        // Invalidate queries to refetch
        queryClient.invalidateQueries({ queryKey: ["tasks", epicId] });
        if (parentTaskId) {
          queryClient.invalidateQueries({ queryKey: ["task", parentTaskId] });
        }

        refetchTasks();
        handleClose();
      }
    } catch (error) {
      console.error("Operation failed:", error);
      message.error(
        currentTask ? "Cập nhật task thất bại!" : "Tạo task thất bại!",
      );
    }
  };

  // Get available parent tasks (exclude current task and its descendants)
  const availableParentTasks = tasks.filter((t) => {
    if (currentTask) {
      // Can't be parent of itself
      if (t.id === currentTask.id) return false;
      // Can't be a descendant of current task
      // (simplified check - in production you'd need recursive check)
      if (t.parentTaskId === currentTask.id) return false;
    }
    return true;
  });

  return (
    <Modal
      title={
        currentTask
          ? "Cập nhật Task"
          : parentTaskId
            ? "Tạo Subtask"
            : "Tạo Task Mới"
      }
      open={isModalOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={
        createMutation.isPending ||
        updateMutation.isPending ||
        setAssignmentsMutation.isPending
      }
      width={600}
      okText={currentTask ? "Cập nhật" : "Tạo Task"}
      cancelText="Hủy bỏ"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
        }}
      >
        <Form.Item
          name="name"
          label="Tên Task"
          rules={[{ required: true, message: "Vui lòng nhập tên task!" }]}
        >
          <Input placeholder="Nhập tên task..." />
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
            <SelectTaskStatus placeholder="Chọn trạng thái" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
            rules={[
              { required: true, message: "Vui lòng chọn mức độ ưu tiên!" },
            ]}
          >
            <SelectTaskPriority placeholder="Chọn mức độ ưu tiên" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item name="dueDate" label="Hạn hoàn thành">
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hạn"
            />
          </Form.Item>
        </div>

        {/* Only show parent task field when creating a new root task */}
        {!parentTaskId && !currentTask && (
          <Form.Item name="parentTaskId" label="Task cha (tùy chọn)">
            <Select
              placeholder="Chọn task cha..."
              allowClear
              showSearch
              optionFilterProp="label"
              options={availableParentTasks.map((t) => ({
                value: t.id,
                label: t.name,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item name="employeeIds" label="Người thực hiện">
          <SelectListEmployee
            mode="multiple"
            placeholder="Tìm kiếm người thực hiện..."
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCreateTask;
