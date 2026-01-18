import { PageContainer } from "@ant-design/pro-components";
import PageTitle from "@/components/common/shared/PageTitle";
import { useDepartmentDetailContext } from "./DepartmentDetailContext";
import DepartmentInfoCard from "./components/DepartmentInfoCard";
import DepartmentChartCard from "./components/DepartmentChartCard";
import DepartmentEmployeeList from "./components/DepartmentEmployeeList";
import { Collapse, Form } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";
import { useUpdateDepartment } from "@/apis/department/createUpdateDepartment";
import type { DEPARTMENT, UpdateDepartmentRequest } from "@/apis/department/model/Department";
import dayjs from "dayjs";

const Index = () => {
    const {
        department,
        isLoadingDepartment,
        editMode,
        setEditMode,
        refetchDepartment,
    } = useDepartmentDetailContext();

    const [form] = Form.useForm();
    const [changeInfoValue, setChangeInfoValue] = useState<Partial<DEPARTMENT>>({});

    // Initialize form with department data
    useEffect(() => {
        if (department) {
            form.setFieldsValue({
                name: department.name,
                departmentCode: department.departmentCode,
                description: department.description,
                managerId: department.managerId,
                foundedAt: department.foundedAt ? dayjs(department.foundedAt) : undefined,
            });
        }
    }, [department, form]);

    const initialValues = useMemo(() => {
        if (!department) return {};
        return {
            name: department.name,
            departmentCode: department.departmentCode,
            description: department.description,
            managerId: department.managerId,
            foundedAt: department.foundedAt ? dayjs(department.foundedAt) : undefined,
        };
    }, [department]);

    const { mutate: updateDepartment, isPending: isLoadingUpdate } = useUpdateDepartment(
        department?.id || 0,
        {
            onSuccess: () => {
                refetchDepartment();
                setEditMode(false);
            },
        }
    );

    const handleUpdate = useCallback(() => {
        const formValues = form.getFieldsValue();

        const updateData: UpdateDepartmentRequest = {
            name: formValues.name || changeInfoValue.name || department?.name || "",
            departmentCode: formValues.departmentCode || changeInfoValue.departmentCode,
            description: formValues.description || changeInfoValue.description,
            managerId: formValues.managerId || changeInfoValue.managerId,
            foundedAt: formValues.foundedAt ? dayjs(formValues.foundedAt).toISOString() : (changeInfoValue.foundedAt ? dayjs(changeInfoValue.foundedAt).toISOString() : department?.foundedAt),
        };

        updateDepartment(updateData);
    }, [form, changeInfoValue, department, updateDepartment]);

    const handleReset = useCallback(() => {
        form.resetFields();
        setChangeInfoValue({});
        setEditMode(false);
    }, [form, setEditMode]);

    const handleFormValuesChange = useCallback(
        (_: unknown, allFields: Partial<DEPARTMENT>) => {
            setChangeInfoValue({
                ...allFields,
            });
        },
        [setChangeInfoValue]
    );

    const disableSubmit = useMemo(() => {
        return isLoadingUpdate;
    }, [isLoadingUpdate]);

    const renderActionButton = useCallback(() => {
        if (!editMode) {
            return (
                <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
                    <CircleButton
                        icon={<MdEditSquare size={32} className="icon-hover-effect" />}
                        onClick={() => setEditMode(true)}
                        key="edit-department"
                        color="green"
                    >
                        Chỉnh sửa
                    </CircleButton>
                </div>
            );
        }

        return (
            <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
                <CircleButton
                    icon={<MdSaveAs size={32} className="icon-hover-effect" />}
                    key="save"
                    color="green"
                    onClick={handleUpdate}
                    disabled={disableSubmit}
                    loading={isLoadingUpdate}
                >
                    Lưu
                </CircleButton>
                <CircleButton
                    onClick={handleReset}
                    icon={<IoMdCloseCircle size={32} className="icon-hover-effect" />}
                    key="close"
                    type="button"
                    color="red"
                >
                    Đóng
                </CircleButton>
            </div>
        );
    }, [editMode, setEditMode, handleUpdate, handleReset, disableSubmit, isLoadingUpdate]);

    return (
        <PageContainer
            loading={isLoadingDepartment}
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: "Phòng ban",
                        },
                        {
                            title: "Danh sách phòng ban",
                            href: "/employee/departments?limit=10&page=1&tab=1",
                        },
                        {
                            title: "Chi tiết",
                        },
                    ],
                },
            }}
            title={<PageTitle title="Chi tiết phòng ban" />}
        >
            <Form
                form={form}
                layout="horizontal"
                name="department-detail"
                labelCol={{
                    style: { fontWeight: "500", width: 160, display: "flex" },
                }}
                initialValues={initialValues}
                onValuesChange={handleFormValuesChange}
            >
                <div className="px-6 space-y-5">
                    {/* Collapse: Department Overview */}
                    <Collapse
                        defaultActiveKey={["overview"]}
                        bordered={false}
                        className="custom-collapse w-full py-10"
                        items={[
                            {
                                key: "overview",
                                label: (
                                    <div className="relative">
                                        <b>Tổng quan phòng ban</b>
                                    </div>
                                ),
                                children: (
                                    <div className="flex flex-row gap-4">
                                        {/* Left: Department Info Card - 40% width */}
                                        <div className="w-[40%]">
                                            <DepartmentInfoCard />
                                        </div>

                                        {/* Right: Chart Card - 60% width */}
                                        <div className="w-[60%]">
                                            <DepartmentChartCard />
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                    <div className=""></div>

                    {/* Collapse: Employee List */}
                    <Collapse
                        defaultActiveKey={["employees"]}
                        bordered={false}
                        className="custom-collapse w-full mt-10"
                        items={[
                            {
                                key: "employees",
                                label: (
                                    <div className="relative">
                                        <b>Danh sách nhân viên</b>
                                    </div>
                                ),
                                children: <DepartmentEmployeeList />,
                            },
                        ]}
                    />
                </div>
            </Form>

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                {renderActionButton()}
            </div>
        </PageContainer>
    );
};

export default Index;
