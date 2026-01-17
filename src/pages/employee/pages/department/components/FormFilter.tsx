import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useDepartmentContext } from "../DepartmentContext";
import type { GetListDepartmentRequest } from "@/apis/department/model/Department";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import dayjs from "dayjs";
import { TABS } from "..";
import { convertToDateRange } from "@/utils/convertToDateRange";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit, tab } = useDepartmentContext();

  useEffect(() => {
    form.resetFields();
  }, [paramsStr, form]);

  const onFinish = useCallback(
    (values: GetListDepartmentRequest) => {
      const { created_range_picker, ...restValues } = values;
      handleFilterSubmit({
        ...restValues,
        created_date_from: created_range_picker?.[0]
          ? dayjs(created_range_picker[0]).startOf("day").unix()
          : undefined,
        created_date_to: created_range_picker?.[1]
          ? dayjs(created_range_picker[1]).endOf("day").unix()
          : undefined,
      });

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
      created_range_picker: convertToDateRange(
        params.created_date_from,
        params.created_date_to
      ),
      updated_range_picker: convertToDateRange(
        params.updated_date_from,
        params.updated_date_to
      ),
    };
  }, [params]);

  const optionsInput = useMemo(() => {
    if (tab == "1") {
      return [
        { value: "q", label: "Mã/Tên phòng ban" },
        { value: "departmentCode", label: "Mã phòng ban" },
        { value: "name", label: "Tên phòng ban" },
      ];
    }
    return [];
  }, [tab]);

  const commonFields = useMemo(
    () => [
      {
        name: "created_range_picker",
        component: (
          <DateRangePicker
            format="DD/MM/YYYY"
            placeholder={["Tạo từ ngày", "Đến ngày"]}
          />
        ),
      },
      {
        name: "updated_range_picker",
        component: (
          <DateRangePicker
            format="DD/MM/YYYY"
            placeholder={["Cập nhật từ ngày", "Đến ngày"]}
          />
        ),
      },
    ],
    []
  );

  const departmentFields = useMemo(
    () => [
      {
        name: "general_code",
        component: (
          <Input
            placeholder="Nhập..."
            allowClear
            addonBefore={
              <Form.Item name="general_code_type" noStyle>
                <Select options={optionsInput} style={{ width: 170 }} />
              </Form.Item>
            }
          />
        ),
      },
      {
        name: "managerId",
        component: (
          <SelectListEmployee placeholder="- Chọn người quản lý -" allowClear />
        ),
      },
      ...commonFields,
    ],
    [commonFields, optionsInput]
  );

  const positionFields = useMemo(() => {
    return [
      {
        name: "name",
        component: <Input placeholder="Nhập tên chức vụ" allowClear />,
      },
      ...commonFields,
    ];
  }, [commonFields]);

  const fields = useMemo(() => {
    if (tab == TABS.DEPARTMENT) {
      return [...departmentFields];
    }
    return [...positionFields];
  }, [tab, departmentFields, positionFields]);

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="department-filter"
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
          <BoxFilter canSearch onReset={handleReset} />
        </div>
      </Form>
    </Card>
  );
};

export default FormFilter;
