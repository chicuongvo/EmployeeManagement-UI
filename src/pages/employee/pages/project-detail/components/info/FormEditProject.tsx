import { Modal, Form, Input, DatePicker, message, InputNumber } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { updateProject, type Project, ProjectStatus } from "@/apis/project";
import { useProjectDetail } from "../../ProjectDetailContext";
import SelectProjectStatus from "@/components/common/form/SelectProjectStatus";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface FormEditProjectProps {
    open: boolean;
    onCancel: () => void;
    project: Project;
}

const FormEditProject = ({ open, onCancel, project }: FormEditProjectProps) => {
    const [form] = Form.useForm();
    const { refetchMembers } = useProjectDetail();

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; payload: any }) =>
            updateProject(data.id, data.payload),
    });

    useEffect(() => {
        if (open && project) {
            form.setFieldsValue({
                name: project.name,
                description: project.description,
                status: project.status,
                budget: project.budget,
                dateRange: project.startDate && project.endDate
                    ? [dayjs(project.startDate), dayjs(project.endDate)]
                    : project.startDate
                        ? [dayjs(project.startDate), null]
                        : undefined,
                managerId: project.managerId,
                githubRepoUrl: project.githubRepoUrl,
                githubAppId: project.githubAppId,
                githubAppInstallationId: project.githubAppInstallationId,
            });
        }
    }, [open, project, form]);

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const projectPayload = {
                name: values.name,
                description: values.description,
                status: values.status,
                budget: values.budget,
                startDate: values.dateRange?.[0]?.toISOString(),
                endDate: values.dateRange?.[1]?.toISOString(),
                managerId: values.managerId,
                githubRepoUrl: values.githubRepoUrl,
                githubAppId: values.githubAppId,
                githubAppInstallationId: values.githubAppInstallationId,
            };

            await updateMutation.mutateAsync({
                id: project.id,
                payload: projectPayload,
            });

            message.success("Cập nhật dự án thành công!");
            refetchMembers(); // This will refetch the project data
            handleClose();
        } catch (error) {
            console.error("Update project failed:", error);
            message.error("Cập nhật dự án thất bại!");
        }
    };

    return (
        <Modal
            title="Chỉnh sửa thông tin dự án"
            open={open}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={updateMutation.isPending}
            width={700}
            okText="Cập nhật"
            cancelText="Hủy bỏ"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: ProjectStatus.PLANNING,
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên dự án"
                    rules={[{ required: true, message: "Vui lòng nhập tên dự án!" }]}
                >
                    <Input placeholder="Nhập tên dự án..." />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <TextArea
                        rows={4}
                        placeholder="Mô tả chi tiết về dự án..."
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                        <SelectProjectStatus placeholder="Chọn trạng thái" />
                    </Form.Item>

                    <Form.Item
                        name="budget"
                        label="Ngân sách (VND)"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Nhập ngân sách..."
                            min={0}
                            step={1000000}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="dateRange"
                    label="Thời gian thực hiện"
                >
                    <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    />
                </Form.Item>

                <Form.Item
                    name="managerId"
                    label="Người quản lý"
                >
                    <SelectListEmployee
                        placeholder="Chọn người quản lý..."
                        allowClear
                    />
                </Form.Item>

                {/* GitHub Integration Section */}
                <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold">Tích hợp GitHub</h3>
                        {project.githubConnected ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                ✓ Đã kết nối
                                {project.githubLastVerified && (
                                    <span className="text-gray-500">
                                        ({new Date(project.githubLastVerified).toLocaleString('vi-VN')})
                                    </span>
                                )}
                            </span>
                        ) : project.githubAppId && project.githubAppInstallationId ? (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                ⚠ Đang kiểm tra...
                            </span>
                        ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Chưa kết nối
                            </span>
                        )}
                    </div>

                    <Form.Item label="GitHub Repository URL" name="githubRepoUrl">
                        <Input placeholder="https://github.com/owner/repo" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="GitHub App ID" name="githubAppId">
                            <Input placeholder="Nhập App ID" />
                        </Form.Item>

                        <Form.Item label="Installation ID" name="githubAppInstallationId">
                            <Input placeholder="Nhập Installation ID" />
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default FormEditProject;
