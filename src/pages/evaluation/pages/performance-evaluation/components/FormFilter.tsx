import { useCallback } from "react";
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

    return (
        <Card className="mb-3 py-1" size="small">
            <Form
                form={form}
                name="performance-filter"
                onFinish={onFinish}
                scrollToFirstError
            >
                <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
                    <Form.Item name="search" className="mb-0">
                        <Input placeholder="Tìm kiếm theo tháng/năm hoặc ID" allowClear />
                    </Form.Item>
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
