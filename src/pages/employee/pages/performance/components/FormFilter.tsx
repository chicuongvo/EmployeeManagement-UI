import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";
import BoxFilter from "@/components/common/shared/BoxFiltered";
import { usePerformanceContext, type GetListPerformanceRequest } from "../PerformanceContext";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit, isLoading } = usePerformanceContext();

  // Sync form values with URL params
  useEffect(() => {
    form.setFieldsValue({
      q: params.q || undefined,
      month: params.month || undefined,
      year: params.year || undefined,
    });
  }, [paramsStr, form, params]);

  const onFinish = useCallback(
    (values: GetListPerformanceRequest) => {
      handleFilterSubmit({
        ...values,
      });

      if (onSearch) {
        setTimeout(() => onSearch(), 100);
      }
    },
    [handleFilterSubmit, onSearch]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
    handleFilterSubmit({});
  }, [form, handleFilterSubmit]);

  const initialValues = useMemo(() => {
    return {
      ...params,
    };
  }, [params]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `Tháng ${i + 1}`,
    }));
  }, []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => ({
      value: currentYear - i,
      label: `${currentYear - i}`,
    }));
  }, []);

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="performance-filter"
        onFinish={onFinish}
        initialValues={initialValues}
        scrollToFirstError
      >
        <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
          <Form.Item name="q" className="mb-0">
            <Input placeholder="Tìm kiếm theo ID báo cáo" allowClear />
          </Form.Item>
          <Form.Item name="month" className="mb-0">
            <Select
              placeholder="Chọn tháng"
              options={monthOptions}
              allowClear
            />
          </Form.Item>
          <Form.Item name="year" className="mb-0">
            <Select
              placeholder="Chọn năm"
              options={yearOptions}
              allowClear
            />
          </Form.Item>
        </div>

        <div className="pt-2 flex gap-4 justify-end">
          <BoxFilter
            canSearch
            onReset={handleReset}
            loading={isLoading}
          />
        </div>
      </Form>
    </Card>
  );
};

export default FormFilter;
