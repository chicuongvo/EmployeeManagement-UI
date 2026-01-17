import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useContractContext } from "../ContractContext";
import type { ContractQueryParams } from "@/types/Contract";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit } = useContractContext();

  useEffect(() => {
    form.resetFields();
  }, [paramsStr, form]);

  const onFinish = useCallback(
    (values: ContractQueryParams) => {
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

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="contract-filter"
        onFinish={onFinish}
        initialValues={initialValues}
        scrollToFirstError
      >
        <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
          <Form.Item name="status" className="mb-0">
            <Select placeholder="Trạng thái" allowClear>
              <Select.Option value="DRAFT">Nháp</Select.Option>
              <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
              <Select.Option value="EXPIRED">Hết hạn</Select.Option>
              <Select.Option value="TERMINATED">Đã chấm dứt</Select.Option>
              <Select.Option value="PENDING">Chờ duyệt</Select.Option>
              <Select.Option value="RENEWED">Đã gia hạn</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" className="mb-0">
            <Select placeholder="Loại hợp đồng" allowClear>
              <Select.Option value="FULL_TIME">Toàn thời gian</Select.Option>
              <Select.Option value="PART_TIME">Bán thời gian</Select.Option>
              <Select.Option value="INTERNSHIP">Thực tập</Select.Option>
              <Select.Option value="PROBATION">Thử việc</Select.Option>
              <Select.Option value="TEMPORARY">Tạm thời</Select.Option>
              <Select.Option value="FREELANCE">Freelance</Select.Option>
              <Select.Option value="OUTSOURCE">Outsource</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="employeeId" className="mb-0">
            <Input placeholder="Employee ID" allowClear type="number" />
          </Form.Item>
          <Form.Item name="signedById" className="mb-0">
            <Input placeholder="Signed By ID" allowClear type="number" />
          </Form.Item>
        </div>

        <div className="pt-2 flex gap-4 justify-end items-center">
          <BoxFilter canSearch onReset={handleReset} />
        </div>
      </Form>
    </Card>
  );
};

export default FormFilter;
