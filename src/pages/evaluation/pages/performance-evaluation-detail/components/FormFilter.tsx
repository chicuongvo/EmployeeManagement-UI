import { useCallback, useMemo } from "react";
import { Card, Form, Input } from "antd";
import BoxFilter from "@/components/common/shared/BoxFiltered";

interface FormFilterProps {
    onSearch?: (values: any) => void;
    onReset?: () => void;
    loading?: boolean;
}

const FormFilter = ({ onSearch, onReset, loading }: FormFilterProps) => {
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
                component: <Input placeholder="Tên nhân viên" allowClear />,
            },
            {
                name: "email",
                component: <Input placeholder="Email" allowClear />,
            },
            {
                name: "employeeCode",
                component: <Input placeholder="Mã nhân viên" allowClear />,
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
                    />
                </div>
            </Form>
        </Card>
    );
};

export default FormFilter;
