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

const FORM_FIELDS = {
    DEPARTMENT_CODE: "departmentCode",
    NAME: "name",
    FOUNDED_AT: "foundedAt",
    DESCRIPTION: "description",
    STATUS: "status",
} as const;

type FORM_FIELDS = typeof FORM_FIELDS[keyof typeof FORM_FIELDS];

const MODAL_POSITION_INCLUDE_FIELDS = [
    FORM_FIELDS.NAME,
    FORM_FIELDS.STATUS,
];

const MODAL_DEPARTMENT_INCLUDE_FIELDS = [
    FORM_FIELDS.DEPARTMENT_CODE,
    FORM_FIELDS.NAME,
    FORM_FIELDS.FOUNDED_AT,
    FORM_FIELDS.DESCRIPTION,
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
        refetch,
    } = useDepartmentContext();

    const [form] = Form.useForm();

    const isDepartment =
        modalMode === "CREATE_DEPARTMENT" || modalMode === "UPDATE_DEPARTMENT";
    const isUpdate =
        modalMode === "UPDATE_DEPARTMENT" || modalMode === "UPDATE_POSITION";

    const includeFields = useMemo(
        () => isDepartment ? MODAL_DEPARTMENT_INCLUDE_FIELDS : MODAL_POSITION_INCLUDE_FIELDS,
        [isDepartment]
    );

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
            label: (isDepartment) => isDepartment ? "Tên phòng ban" : "Tên chức vụ",
            rules: (isDepartment) => [
                {
                    required: true,
                    message: isDepartment
                        ? "Vui lòng nhập tên phòng ban"
                        : "Vui lòng nhập tên chức vụ",
                },
            ],
            render: (_, isDepartment) => (
                <Input
                    placeholder={
                        isDepartment ? "Nhập tên phòng ban" : "Nhập tên chức vụ"
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
    ];

    const visibleFormFields = useMemo(
        () => FORM_FIELDS_CONFIG.filter((field) => includeFields.includes(field.key)),
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
        } else {
            return {
                name: selectedPosition?.name,
                status: selectedPosition?.status ?? "ACTIVE",
            };
        }
    }, [selectedDepartment, selectedPosition, isDepartment]);

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

    const handleSubmit = useCallback(() => {
        form.validateFields().then((values) => {
            if (isDepartment) {
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
            } else {
                if (modalMode === "UPDATE_POSITION") {
                    updatePos(values);
                } else {
                    createPos(values);
                }
            }
        });
    }, [form, isDepartment, modalMode, updateDept, createDept, updatePos, createPos]);

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
            default:
                return "";
        }
    }, [modalMode]);

    const isLoading =
        isLoadingCreateDept ||
        isLoadingUpdateDept ||
        isLoadingCreatePos ||
        isLoadingUpdatePos;

    const hasChanges = useMemo(() => {
        if (!initialValues || !currentValues) return false;

        const checkKeys = isDepartment
            ? MODAL_DEPARTMENT_INCLUDE_FIELDS
            : MODAL_POSITION_INCLUDE_FIELDS;

        return checkKeys.some((key) => {
            const fieldKey = key as keyof typeof initialValues;
            const initial = initialValues[fieldKey];
            const current = currentValues[key as string];

            if (dayjs.isDayjs(initial)) {
                return !dayjs(current).isSame(initial, "day");
            }

            return initial !== current;
        });
    }, [initialValues, currentValues, isDepartment]);

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
