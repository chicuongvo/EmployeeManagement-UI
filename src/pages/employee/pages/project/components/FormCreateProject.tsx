import { Form, Input, DatePicker, InputNumber, Modal, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import dayjs from "dayjs";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import SelectProjectStatus from "@/components/common/form/SelectProjectStatus";
import { createProject, updateProject } from "@/apis/project";
import type {
    CreateProjectRequest,
    UpdateProjectRequest,
    Project,
} from "@/apis/project";
import { useProjectContext } from "../ProjectContext";

const { TextArea } = Input;

interface FormCreateProjectProps {
    open: boolean;
    onCancel: () => void;
    project?: Project | null;
}

const FormCreateProject = ({
    open,
    onCancel,
    project,
}: FormCreateProjectProps) => {
    const [form] = Form.useForm();
    const { refetch } = useProjectContext();

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            message.success("Tạo dự án thành công!");
            form.resetFields();
            refetch();
            onCancel();
        },
        onError: () => {
            message.error("Tạo dự án thất bại!");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProjectRequest }) =>
            updateProject(id, data),
        onSuccess: () => {
            message.success("Cập nhật dự án thành công!");
            form.resetFields();
            refetch();
            onCancel();
        },
        onError: () => {
            message.error("Cập nhật dự án thất bại!");
        },
    });

    useEffect(() => {
        if (open && project) {
            form.setFieldsValue({
                name: project.name,
                description: project.description,
                startDate: project.startDate ? dayjs(project.startDate) : null,
                endDate: project.endDate ? dayjs(project.endDate) : null,
                status: project.status,
                budget: project.budget,
                managerId: project.managerId,
            });
        } else if (open) {
            form.resetFields();
        }
    }, [open, project, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: CreateProjectRequest = {
                name: values.name,
                description: values.description,
                startDate: values.startDate
                    ? dayjs(values.startDate).toISOString()
                    : dayjs().toISOString(),
                endDate: values.endDate ? dayjs(values.endDate).toISOString() : undefined,
                status: values.status,
                budget: values.budget,
                managerId: values.managerId,
            };

            if (project) {
                updateMutation.mutate({ id: project.id, data: payload });
            } else {
                createMutation.mutate(payload);
            }
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return (
        <Modal
            title={project ? "Cập nhật dự án" : "Tạo dự án mới"}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={project ? "Cập nhật" : "Tạo mới"}
            cancelText="Hủy"
            width={700}
            confirmLoading={createMutation.isPending || updateMutation.isPending}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: "PLANNING",
                }}
            >
                <Form.Item
                    label="Tên dự án"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên dự án!" },
                        { max: 255, message: "Tên dự án không được quá 255 ký tự!" },
                    ]}
                >
                    <Input placeholder="Nhập tên dự án" />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <TextArea rows={4} placeholder="Nhập mô tả dự án" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày bắt đầu"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item label="Ngày kết thúc" name="endDate">
                        <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày kết thúc"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                        <SelectProjectStatus placeholder="Chọn trạng thái" />
                    </Form.Item>

                    <Form.Item label="Ngân sách (VNĐ)" name="budget">
                        <InputNumber
                            placeholder="Nhập ngân sách"
                            style={{ width: "100%" }}
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0) as 0}
                        />
                    </Form.Item>
                </div>

                <Form.Item label="Người quản lý" name="managerId">
                    <SelectListEmployee placeholder="Chọn người quản lý" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormCreateProject;
