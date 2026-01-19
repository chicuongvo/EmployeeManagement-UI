import { useCallback, useMemo } from "react";
import { Card, Form, Input } from "antd";
import BoxFilter from "@/components/common/shared/BoxFiltered";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";

interface FormFilterProps {
    onSearch?: (values: any) => void;
    onReset?: () => void;
    onAddReport?: () => void;
    loading?: boolean;
}

const FormFilter = ({ onSearch, onReset, onAddReport, loading }: FormFilterProps) => {
    const [form] = Form.useForm();

    const onFinish = useCallback(
        (values: any) => {
            if (onSearch) {
                onSearch(values);
            }
        },
        [onSearch]
    );

    const handleReset = useCallback(() => {
        form.resetFields();
        if (onReset) {
            onReset();
        }
    }, [form, onReset]);

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
                name="performance-detail-filter"
                onFinish={onFinish}
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
                        loading={loading}
                        prependActions={
                            <PrimaryButton
                                icon={<PlusOutlined className="icon-hover-effect" />}
                                type="button"
                                onClick={onAddReport}
                                disabled={loading}
                                loading={loading}
                                color="blue"
                            >
                                Thêm báo cáo mới
                            </PrimaryButton>
                        }
                    />
                </div>
            </Form>
        </Card>
    );
};

export default FormFilter;
