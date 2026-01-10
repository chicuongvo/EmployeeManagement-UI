import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useEmployeeContext } from "../EmployeeContext";
import type { GetListEmployeeRequest } from "@/apis/employee/model/Employee";

interface FormFilterProps {
    onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
    const [form] = Form.useForm();
    const { params, paramsStr, handleFilterSubmit } = useEmployeeContext();

    useEffect(() => {
        form.resetFields();
    }, [paramsStr, form]);

    const onFinish = useCallback(
        (values: GetListEmployeeRequest) => {
            handleFilterSubmit(values);

            if (onSearch) {
                setTimeout(() => onSearch(), 100);
            }
        },
        [handleFilterSubmit, onSearch]
    );

    const handleReset = useCallback(() => {
        handleFilterSubmit({});
    }, [handleFilterSubmit]);

    const initialValues = useMemo(() => {
        return {
            ...params,
        };
    }, [params]);

    const fields = useMemo(
        () => [
            {
                name: "fullName",
                component: <Input placeholder="Full Name" allowClear />,
            },
            {
                name: "email",
                component: <Input placeholder="Email" allowClear />,
            },
            {
                name: "phone",
                component: <Input placeholder="Phone" allowClear />,
            },
            {
                name: "employeeCode",
                component: <Input placeholder="Employee Code" allowClear />,
            },
            {
                name: "citizenId",
                component: <Input placeholder="Citizen ID" allowClear />,
            },
            {
                name: "department",
                component: <Input placeholder="Department" allowClear />,
            },
            {
                name: "position",
                component: <Input placeholder="Position" allowClear />,
            },
        ],
        []
    );

    return (
        <Card className="mb-3 py-1" size="small">
            <Form
                form={form}
                name="employee-filter"
                onFinish={onFinish}
                initialValues={initialValues}
                scrollToFirstError
            >
                <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
                    {fields.map(({ name, component }) => (
                        <Form.Item key={name} name={name} className="mb-0">
                            {component}
                        </Form.Item>
                    ))}
                </div>

                <div className="pt-2 flex gap-4 justify-end">
                    <BoxFilter
                        canSearch
                        onReset={handleReset}
                    />
                </div>
            </Form>
        </Card>
    );
};

export default FormFilter;
