import { useState, useEffect, useMemo } from "react";
import { Modal, Form, Select, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { performanceService } from "@/apis/performance/performanceService";

interface AddPerformanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (month: number, year: number) => void;
}

export default function AddPerformanceDialog({ open, onOpenChange, onSubmit }: AddPerformanceDialogProps) {
    const [form] = Form.useForm();
    const [existingPerformances, setExistingPerformances] = useState<{ month: number; year: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Fetch existing performances to check for duplicates
    useEffect(() => {
        if (open) {
            fetchExistingPerformances();
            form.setFieldsValue({
                month: currentMonth,
                year: currentYear,
            });
        }
    }, [open, form, currentMonth, currentYear]);

    const fetchExistingPerformances = async () => {
        try {
            setLoading(true);
            const response = await performanceService.getAll({ page: 1, limit: 1000 });
            setExistingPerformances(
                response.data.map((p) => ({ month: p.month, year: p.year }))
            );
        } catch (error) {
            console.error("Failed to fetch existing performances:", error);
        } finally {
            setLoading(false);
        }
    };

    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: `Tháng ${i + 1}`,
        }));
    }, []);

    const yearOptions = useMemo(() => {
        return Array.from({ length: 10 }, (_, i) => ({
            value: currentYear - 5 + i,
            label: `${currentYear - 5 + i}`,
        }));
    }, [currentYear]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { month, year } = values;

            // Check for duplicate
            const isDuplicate = existingPerformances.some(
                (p) => p.month === month && p.year === year
            );

            if (isDuplicate) {
                message.error(`Phiếu đánh giá tháng ${month}/${year} đã tồn tại!`);
                return;
            }

            setSubmitting(true);
            await onSubmit(month, year);
            form.resetFields();
            onOpenChange(false);
        } catch (error) {
            // Form validation error
            console.error("Validation failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onOpenChange(false);
    };

    // Check if current selection is duplicate
    const selectedMonth = Form.useWatch("month", form);
    const selectedYear = Form.useWatch("year", form);
    const isDuplicateWarning = useMemo(() => {
        if (!selectedMonth || !selectedYear) return false;
        return existingPerformances.some(
            (p) => p.month === selectedMonth && p.year === selectedYear
        );
    }, [selectedMonth, selectedYear, existingPerformances]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500" />
                    <span>Thêm phiếu đánh giá mới</span>
                </div>
            }
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="Thêm mới"
            cancelText="Hủy"
            confirmLoading={submitting}
            okButtonProps={{ 
                disabled: isDuplicateWarning,
                className: "bg-green-500 hover:bg-green-600"
            }}
            width={480}
            destroyOnClose
        >
            <div className="py-4">
                <p className="text-gray-500 mb-4">
                    Chọn tháng và năm để tạo phiếu đánh giá mới
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        month: currentMonth,
                        year: currentYear,
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="month"
                            label="Tháng"
                            rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
                        >
                            <Select
                                placeholder="Chọn tháng"
                                options={monthOptions}
                                loading={loading}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="year"
                            label="Năm"
                            rules={[{ required: true, message: "Vui lòng chọn năm" }]}
                        >
                            <Select
                                placeholder="Chọn năm"
                                options={yearOptions}
                                loading={loading}
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    {isDuplicateWarning && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                                <span className="text-red-500">⚠️</span>
                                Phiếu đánh giá tháng {selectedMonth}/{selectedYear} đã tồn tại!
                            </p>
                        </div>
                    )}
                </Form>
            </div>
        </Modal>
    );
}
