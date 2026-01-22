import { Modal, Radio, Space, Avatar, Form, Divider } from "antd";
import { useState, useEffect, useRef } from "react";
import type { DepartmentManager } from "@/apis/department/model/Department";
import SelectListPosition from "@/components/common/form/SelectListPosition";
import SelectListDepartment from "@/components/common/form/SelectListDepartment";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { getPosition } from "@/apis/position";

interface ModalChangeManagerProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: (action: "CHANGE_POSITION" | "REMOVE_POSITION", newPositionId?: number, newDepartmentId?: number) => void;
    currentManager: DepartmentManager | null;
    departmentName: string;
}

type ManagerAction = "CHANGE_POSITION" | "REMOVE_POSITION" | "CANCEL";

const DEFAULT_AVATAR = "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg";

const ModalChangeManager = ({
    open,
    onCancel,
    onConfirm,
    currentManager,
    departmentName,
}: ModalChangeManagerProps) => {
    const [form] = Form.useForm();
    const [selectedAction, setSelectedAction] = useState<ManagerAction>("CHANGE_POSITION");
    // Ref to track if department is being set from position selection
    const isSettingDepartmentFromPosition = useRef(false);
    // Ref to track previous departmentId value
    const prevDepartmentIdRef = useRef<number | undefined>(undefined);

    // Watch departmentId and positionId changes from form
    const newDepartmentId = Form.useWatch("newDepartmentId", form);
    const newPositionId = Form.useWatch("newPositionId", form);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            setSelectedAction("CHANGE_POSITION");
            form.resetFields();
            prevDepartmentIdRef.current = undefined;
            isSettingDepartmentFromPosition.current = false;
        }
    }, [open, form]);

    // Clear position when department changes (except when set from position)
    useEffect(() => {
        const currentDepartmentId = newDepartmentId ?? undefined;
        const prevDepartmentId = prevDepartmentIdRef.current;

        // Skip if department is being set from position selection
        if (isSettingDepartmentFromPosition.current) {
            isSettingDepartmentFromPosition.current = false;
            prevDepartmentIdRef.current = currentDepartmentId;
            return;
        }

        // Skip on initial mount (when both are undefined or same)
        if (prevDepartmentId === undefined && currentDepartmentId === undefined) {
            prevDepartmentIdRef.current = currentDepartmentId;
            return;
        }

        // If department changed (including cleared), clear position
        if (currentDepartmentId !== prevDepartmentId) {
            form.setFieldsValue({
                newPositionId: undefined,
            });
        }

        // Update ref for next comparison
        prevDepartmentIdRef.current = currentDepartmentId;
    }, [newDepartmentId, form]);

    const handleOk = async () => {
        if (selectedAction === "CANCEL") {
            onCancel();
            return;
        }

        if (selectedAction === "CHANGE_POSITION") {
            // Validate form fields
            try {
                await form.validateFields(["newDepartmentId", "newPositionId"]);
            } catch {
                return;
            }

            // Get values from form
            const formValues = form.getFieldsValue();
            const departmentId = formValues.newDepartmentId;
            const positionId = formValues.newPositionId;

            if (!positionId || !departmentId) {
                return;
            }

            onConfirm(selectedAction, positionId, departmentId);
        } else {
            onConfirm(selectedAction);
        }
    };

    const handleCancel = () => {
        setSelectedAction("CHANGE_POSITION");
        form.resetFields();
        prevDepartmentIdRef.current = undefined;
        isSettingDepartmentFromPosition.current = false;
        onCancel();
    };

    return (
        <Modal
            title="Thay đổi Trưởng phòng"
            open={open}
            // onOk={handleOk}
            onCancel={handleCancel}
            // okText="Xác nhận"
            // cancelText="Đóng"
            width={550}
            footer={null}

        >
            <div className="py-4">
                {/* Current Manager Info */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3">
                        Phòng <span className="font-semibold text-gray-800">{departmentName}</span> hiện có Trưởng phòng là:
                    </p>
                    {currentManager && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Avatar
                                src={currentManager.avatar || DEFAULT_AVATAR}
                                size={40}
                            >
                                {currentManager.fullName.charAt(0)}
                            </Avatar>
                            <div>
                                <p className="font-semibold text-gray-800">{currentManager.fullName}</p>
                                <p className="text-xs text-gray-500">
                                    {currentManager.employeeCode} • {currentManager.email}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Options */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        Bạn muốn xử lý thế nào?
                    </p>
                    <Radio.Group
                        onChange={(e) => setSelectedAction(e.target.value)}
                        value={selectedAction}
                        className="w-full"
                    >
                        <Space direction="vertical" className="w-full" size="middle">
                            <Radio value="CHANGE_POSITION" className="w-full">
                                <span className="text-sm">Chuyển <span className="font-medium">{currentManager?.fullName}</span> sang position khác</span>
                            </Radio>

                            {/* Position and Department Selectors - Only show when CHANGE_POSITION is selected */}
                            {selectedAction === "CHANGE_POSITION" && (
                                <div className="px-5 py-3 bg-gray-50 rounded-lg space-y-3 ">
                                    <Form form={form} layout="vertical" >
                                        <Form.Item
                                            label={<span className="text-xs font-medium">Phòng ban mới</span>}
                                            name="newDepartmentId"
                                            rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                                            className="mb-2"
                                        >
                                            <SelectListDepartment
                                                placeholder="Chọn phòng ban"
                                                value={newDepartmentId ?? undefined}
                                                onChange={async (value: number | null | undefined) => {
                                                    const departmentId = value ?? undefined;
                                                    
                                                    // Update form field - useEffect will handle clearing position
                                                    form.setFieldsValue({
                                                        newDepartmentId: departmentId,
                                                    });
                                                }}
                                                allowClear
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={<span className="text-xs font-medium">Vị trí mới</span>}
                                            name="newPositionId"
                                            rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
                                            className="mb-0"
                                        >
                                            <SelectListPosition
                                                placeholder="Chọn vị trí"
                                                value={newPositionId ?? undefined}
                                                departmentId={newDepartmentId ?? undefined}
                                                onChange={async (value: number | null | undefined) => {
                                                    const positionId = value ?? undefined;
                                                    
                                                    // Update form field
                                                    form.setFieldsValue({
                                                        newPositionId: positionId,
                                                    });
                                                    
                                                    // If position is selected, fetch it to get departmentId and auto-set department
                                                    if (positionId) {
                                                        try {
                                                            const position = await getPosition(positionId);
                                                            if (position?.departmentId) {
                                                                // Set flag to indicate department is being set from position
                                                                isSettingDepartmentFromPosition.current = true;
                                                                form.setFieldsValue({
                                                                    newDepartmentId: position.departmentId,
                                                                });
                                                            }
                                                        } catch (error) {
                                                            console.error("Failed to fetch position:", error);
                                                        }
                                                    }
                                                    // If position is cleared, don't clear department (as per requirement)
                                                }}
                                                allowClear
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            )}

                            <Radio value="REMOVE_POSITION" className="w-full">
                                <span className="text-sm">Để <span className="font-medium">{currentManager?.fullName}</span> tạm thời không giữ vị trí nào </span>
                            </Radio>
                            <Radio value="CANCEL" className="w-full">
                                <span className="text-sm">Huỷ thao tác</span>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>

                {/* Info Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                        <span className="font-semibold">Lưu ý:</span> Người quản lý mới sẽ tự động được chuyển sang vị trí "{departmentName} Manager"
                    </p>
                </div>
            </div>

            <Divider className=" mt-2" />
            <div className="flex justify-end -mt-2 gap-2">
                <PrimaryButton
                    icon={<SaveOutlined />}
                    onClick={handleOk}
                    color="green"
                // loading={isLoading}
                // disabled={isDisableSubmit}
                >
                    Xác nhận
                </PrimaryButton>
                <PrimaryButton
                    className="bg-transparent border text-green border-green hover:bg-transparent"
                    onClick={handleCancel}
                    icon={<CloseOutlined />}
                >
                    Hủy
                </PrimaryButton>

            </div>
        </Modal>
    );
};

export default ModalChangeManager;