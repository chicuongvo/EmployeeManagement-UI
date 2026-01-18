import { DatePicker, Divider, Form, Input, Modal } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ReactNode } from "react";

import PrimaryButton from "@/components/common/button/PrimaryButton";

import { useDepartmentContext } from "../DepartmentContext";
import {
    useCreateDepartment,
    useUpdateDepartment,
} from "@/apis/department/createUpdateDepartment";
import {
    useCreatePosition,
    useUpdatePosition,
} from "@/apis/position/createUpdatePosition";
import ActiveStatus from "@/components/common/status/ActiveStatus";
import SelectListPosition from "@/components/common/form/SelectListPosition";
import SelectListDepartment from "@/components/common/form/SelectListDepartment";
import SelectListRole from "@/components/common/form/SelectListRole";
import { useCreateRole, useUpdateRole } from "@/apis/role";
import { TABS } from "..";

const FORM_FIELDS = {
    DEPARTMENT_CODE: "departmentCode",
    NAME: "name",
    FOUNDED_AT: "foundedAt",
    DESCRIPTION: "description",
    STATUS: "status",
    ROLE_ID: "roleId",
    DEPARTMENT_ID: "departmentId",
} as const;

type FORM_FIELDS = typeof FORM_FIELDS[keyof typeof FORM_FIELDS];

const MODAL_POSITION_INCLUDE_FIELDS: FORM_FIELDS[] = [
    FORM_FIELDS.NAME,
    FORM_FIELDS.STATUS,
    FORM_FIELDS.ROLE_ID,
    FORM_FIELDS.DEPARTMENT_ID,
];

const MODAL_DEPARTMENT_INCLUDE_FIELDS: FORM_FIELDS[] = [
    FORM_FIELDS.DEPARTMENT_CODE,
    FORM_FIELDS.NAME,
    FORM_FIELDS.FOUNDED_AT,
    FORM_FIELDS.DESCRIPTION,
    FORM_FIELDS.STATUS,
];

const MODAL_ROLE_INCLUDE_FIELDS: FORM_FIELDS[] = [
    FORM_FIELDS.NAME,
    FORM_FIELDS.STATUS,
];

interface FormFieldConfig {
    key: FORM_FIELDS;
    name: string;
    label: (isDepartment: boolean) => string;
    rules?: (isDepartment: boolean) => Array<{ required?: boolean; message?: string }>;
    render: (form: ReturnType<typeof Form.useForm>[0], isDepartment: boolean, isUpdate: boolean) => ReactNode;
}

const ModalCreateUpdateDepartmentPosition = () => {
    const {
        isModalOpen,
        setIsModalOpen,
        modalMode,
        selectedDepartment,
        selectedPosition,
        selectedRole,
        refetch,
        tab,
    } = useDepartmentContext();

    const [form] = Form.useForm();

    const isDepartment =
        modalMode === "CREATE_DEPARTMENT" || modalMode === "UPDATE_DEPARTMENT";
    const isUpdate =
        modalMode === "UPDATE_DEPARTMENT" || modalMode === "UPDATE_POSITION" || modalMode === "UPDATE_ROLE";

    const includeFields = useMemo(() => {
        if (tab === TABS.DEPARTMENT) return MODAL_DEPARTMENT_INCLUDE_FIELDS;
        if (tab === TABS.POSITION) return MODAL_POSITION_INCLUDE_FIELDS;
        return MODAL_ROLE_INCLUDE_FIELDS;
    }, [tab]);

    const currentValues = Form.useWatch([], form);

    const FORM_FIELDS_CONFIG: FormFieldConfig[] = [
        {
            key: FORM_FIELDS.DEPARTMENT_CODE,
            name: "departmentCode",
            label: () => "Mã phòng ban",
            rules: () => [{ required: true, message: "Vui lòng nhập mã phòng ban" }],
            render: () => <Input placeholder="Nhập mã phòng ban" />,
        },
        {
            key: FORM_FIELDS.NAME,
            name: "name",
            label: () => {
                if (tab === TABS.DEPARTMENT) return "Tên phòng ban";
                if (tab === TABS.POSITION) return "Tên chức vụ";
                return "Tên cấp bậc";
            },
            rules: () => [
                {
                    required: true,
                    message: tab === TABS.DEPARTMENT
                        ? "Vui lòng nhập tên phòng ban"
                        : tab === TABS.POSITION
                            ? "Vui lòng nhập tên chức vụ"
                            : "Vui lòng nhập tên cấp bậc",
                },
            ],
            render: () => (
                <Input
                    placeholder={
                        tab === TABS.DEPARTMENT
                            ? "Nhập tên phòng ban"
                            : tab === TABS.POSITION
                                ? "Nhập tên chức vụ"
                                : "Nhập tên cấp bậc"
                    }
                />
            ),
        },

        {
            key: FORM_FIELDS.FOUNDED_AT,
            name: "foundedAt",
            label: () => "Ngày thành lập",
            rules: () => [
                { required: true, message: "Vui lòng chọn ngày thành lập" },
            ],
            render: () => <DatePicker className="w-full" format="DD/MM/YYYY" />,
        },
        {
            key: FORM_FIELDS.DESCRIPTION,
            name: "description",
            label: () => "Mô tả",
            render: () => <Input.TextArea placeholder="Nhập mô tả" rows={4} />,
        },
        {
            key: FORM_FIELDS.STATUS,
            name: "status",
            label: () => "Trạng thái",
            rules: () => [{ required: true }],
            render: (form, _, isUpdate) => (
                <ActiveStatus
                    status={currentValues?.status || form.getFieldValue("status")}
                    editable={isUpdate}
                    onChangeStatus={(status: string) => {
                        form.setFieldValue("status", status);

                    }}
                />
            ),
        },
        {
            key: FORM_FIELDS.ROLE_ID,
            name: "roleId",
            label: () => "Cấp bậc",
            render: () => (
                <SelectListRole
                    placeholder="Chọn cấp bậc"
                    allowClear
                    showSearch
                    defaultValue={currentValues?.roleId}
                />
            ),
        },
        {
            key: FORM_FIELDS.DEPARTMENT_ID,
            name: "departmentId",
            label: () => "Phòng ban",
            render: () => (
                <SelectListDepartment
                    placeholder="Chọn phòng ban"
                    allowClear
                    showSearch
                    defaultValue={currentValues?.departmentId}
                />
            ),
        },
    ];

    const visibleFormFields = useMemo(
        () => FORM_FIELDS_CONFIG.filter((field) => (includeFields as any).includes(field.key)),
        [includeFields]
    );

    const initialValues = useMemo(() => {
        if (isDepartment) {
            return {
                departmentCode: selectedDepartment?.departmentCode,
                name: selectedDepartment?.name,
                foundedAt: selectedDepartment?.foundedAt
                    ? dayjs(selectedDepartment.foundedAt)
                    : undefined,
                description: selectedDepartment?.description,
                managerId: selectedDepartment?.managerId,
                status: selectedDepartment?.status ?? "ACTIVE",
            };
        } else if (tab === TABS.POSITION) {
            return {
                name: selectedPosition?.name,
                status: selectedPosition?.status ?? "ACTIVE",
                roleId: selectedPosition?.roleId,
                departmentId: selectedPosition?.departmentId,
            };
        } else if (modalMode === "CREATE_ROLE" || modalMode === "UPDATE_ROLE") {
            return {
                name: selectedRole?.name,
                status: selectedRole?.status ?? "ACTIVE",
            };
        }
        return {};
    }, [selectedDepartment, selectedPosition, selectedRole, modalMode, tab, isDepartment]);

    useEffect(() => {
        if (isModalOpen) {
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues, isModalOpen]);

    const onClose = useCallback(() => {
        setIsModalOpen(false);
        form.resetFields();
    }, [form, setIsModalOpen]);

    const { mutate: createDept, isPending: isLoadingCreateDept } =
        useCreateDepartment({
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const { mutate: updateDept, isPending: isLoadingUpdateDept } =
        useUpdateDepartment(selectedDepartment?.id ?? 0, {
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const { mutate: createPos, isPending: isLoadingCreatePos } =
        useCreatePosition({
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const { mutate: updatePos, isPending: isLoadingUpdatePos } =
        useUpdatePosition(selectedPosition?.id ?? 0, {
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const { mutate: createRoleMutate, isPending: isLoadingCreateRole } =
        useCreateRole({
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const { mutate: updateRoleMutate, isPending: isLoadingUpdateRole } =
        useUpdateRole(selectedRole?.id ?? 0, {
            onSuccess: () => {
                refetch();
                onClose();
            },
        });

    const handleSubmit = useCallback(() => {
        form.validateFields().then((values) => {
            if (tab === TABS.DEPARTMENT) {
                const params = {
                    ...values,
                    foundedAt: values.foundedAt
                        ? values.foundedAt.toISOString()
                        : undefined,
                };
                if (modalMode === "UPDATE_DEPARTMENT") {
                    updateDept(params);
                } else {
                    createDept(params);
                }
            } else if (tab === TABS.POSITION) {
                if (modalMode === "UPDATE_POSITION") {
                    updatePos(values);
                } else {
                    createPos(values);
                }
            } else {
                if (modalMode === "UPDATE_ROLE") {
                    updateRoleMutate(values);
                } else {
                    createRoleMutate(values);
                }
            }
        });
    }, [form, tab, modalMode, updateDept, createDept, updatePos, createPos, updateRoleMutate, createRoleMutate]);

    const title = useMemo(() => {
        switch (modalMode) {
            case "CREATE_DEPARTMENT":
                return "Thêm mới phòng ban";
            case "UPDATE_DEPARTMENT":
                return "Cập nhật phòng ban";
            case "CREATE_POSITION":
                return "Thêm mới chức vụ";
            case "UPDATE_POSITION":
                return "Cập nhật chức vụ";
            case "CREATE_ROLE":
                return "Thêm mới cấp bậc";
            case "UPDATE_ROLE":
                return "Cập nhật cấp bậc";
            default:
                return "";
        }
    }, [modalMode]);

    const isLoading =
        isLoadingCreateDept ||
        isLoadingUpdateDept ||
        isLoadingCreatePos ||
        isLoadingUpdatePos ||
        isLoadingCreateRole ||
        isLoadingUpdateRole;

    const hasChanges = useMemo(() => {
        if (!initialValues || !currentValues) return false;

        const checkKeys = includeFields;

        return checkKeys.some((key) => {
            const fieldKey = key as keyof typeof initialValues;
            const initial = (initialValues as any)[fieldKey];
            const current = currentValues[key as string];

            if (dayjs.isDayjs(initial)) {
                return !dayjs(current).isSame(initial, "day");
            }

            return initial !== current;
        });
    }, [initialValues, currentValues, includeFields]);

    const isAllRequiredFieldsFilled = useMemo(() => {
        return visibleFormFields
            .filter((field) =>
                field.rules?.(isDepartment).some((r) => r.required)
            )
            .every((field) => {
                const value = currentValues?.[field.name];
                return value !== undefined && value !== null && value !== "";
            });
    }, [visibleFormFields, currentValues, isDepartment]);

    const isDisableSubmit = isUpdate
        ? !hasChanges || !isAllRequiredFieldsFilled
        : !isAllRequiredFieldsFilled;

    return (
        <>
            <Modal
                open={isModalOpen}
                key="modal-create-update-dept-pos"
                title={
                    <div className="!text-lg font-medium">
                        {title}
                        <Divider className="!mt-2" />
                    </div>
                }
                footer={null}
                width={500}
                onCancel={onClose}
            >
                <Form
                    scrollToFirstError
                    labelAlign="left"
                    form={form}
                    initialValues={initialValues}
                    name="form-create-update-dept-pos"
                    layout="vertical"
                    autoComplete="off"
                    className="!-mt-1"
                >
                    {visibleFormFields.map((field) => (
                        <Form.Item
                            key={field.key}
                            label={field.label(isDepartment)}
                            name={field.name}
                            rules={field.rules?.(isDepartment)}
                            className="!mb-4"
                        >
                            {field.render(form, isDepartment, isUpdate)}
                        </Form.Item>
                    ))}

                    <Divider className=" mt-2" />
                    <div className="flex justify-end -mt-2">
                        <PrimaryButton
                            icon={isUpdate ? <SaveOutlined /> : <PlusOutlined />}
                            onClick={handleSubmit}
                            color="green"
                            loading={isLoading}
                            disabled={isDisableSubmit}
                        >
                            {isUpdate ? "Cập nhật" : "Thêm mới"}
                        </PrimaryButton>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCreateUpdateDepartmentPosition;
