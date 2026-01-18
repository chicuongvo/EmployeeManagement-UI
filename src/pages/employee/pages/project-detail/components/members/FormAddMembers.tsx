import { Modal, Form, message } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProjectMembers } from "@/apis/project";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";

interface FormAddMembersProps {
    open: boolean;
    onCancel: () => void;
    projectId: number;
    existingMemberIds: number[];
    onSuccess: () => void;
}

const FormAddMembers = ({ open, onCancel, projectId, existingMemberIds, onSuccess }: FormAddMembersProps) => {
    const [form] = Form.useForm();
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);

    const addMembersMutation = useMutation({
        mutationFn: addProjectMembers(projectId),
    });

    const handleClose = () => {
        form.resetFields();
        setSelectedEmployeeIds([]);
        onCancel();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const employeeIds = values.employeeIds || [];

            // Filter out existing members
            const newMemberIds = employeeIds.filter((id: number) => !existingMemberIds.includes(id));

            if (newMemberIds.length === 0) {
                message.warning("Tất cả nhân viên đã là thành viên của dự án!");
                return;
            }

            await addMembersMutation.mutateAsync(newMemberIds);

            message.success(`Đã thêm ${newMemberIds.length} thành viên vào dự án!`);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error("Add members failed:", error);
            message.error("Thêm thành viên thất bại!");
        }
    };

    return (
        <Modal
            title="Thêm thành viên vào dự án"
            open={open}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={addMembersMutation.isPending}
            width={600}
            okText="Thêm thành viên"
            cancelText="Hủy bỏ"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="employeeIds"
                    label="Chọn nhân viên"
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một nhân viên!" }]}
                >
                    <SelectListEmployee
                        mode="multiple"
                        placeholder="Tìm kiếm và chọn nhân viên..."
                        allowClear
                        onChange={(value) => setSelectedEmployeeIds(value as number[])}
                    />
                </Form.Item>

                {selectedEmployeeIds.length > 0 && (
                    <div className="text-sm text-gray-500">
                        Đã chọn: <span className="font-semibold">{selectedEmployeeIds.length}</span> nhân viên
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default FormAddMembers;
