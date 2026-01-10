import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useEmployeeContext } from "../EmployeeContext";
import type { GetListEmployeeRequest } from "@/apis/employee/model/Employee";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListDepartment from "@/components/common/form/SelectListDepartment";
import SelectListPosition from "@/components/common/form/SelectListPosition";
import dayjs from "dayjs";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit, tab } = useEmployeeContext();

  useEffect(() => {
    form.resetFields();
  }, [paramsStr, form]);

  const onFinish = useCallback(
    (values: GetListEmployeeRequest) => {
      const { created_range_picker, updated_range_picker, ...restValues } =
        values;
      handleFilterSubmit({
        ...restValues,
        created_date_from: created_range_picker?.[0]
          ? dayjs(created_range_picker[0]).startOf("day").unix()
          : undefined,
        created_date_to: created_range_picker?.[1]
          ? dayjs(created_range_picker[1]).endOf("day").unix()
          : undefined,
        updated_date_from: updated_range_picker?.[0]
          ? dayjs(updated_range_picker[0]).startOf("day").unix()
          : undefined,
        updated_date_to: updated_range_picker?.[1]
          ? dayjs(updated_range_picker[1]).endOf("day").unix()
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
    };
  }, [params]);

  const optionsInput = useMemo(() => {
    if (tab == "1") {
      return [
        { value: "fullName", label: "Full Name" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "employeeCode", label: "Employee Code" },
        { value: "citizenId", label: "Citizen ID" },
      ];
    }
    return [];
  }, [tab]);

  const fields = useMemo(
    () => [
      {
        name: "general_code",
        component: (
          <Input
            placeholder="Input code"
            allowClear
            addonBefore={
              <Form.Item name="general_code_type" noStyle>
                <Select options={optionsInput} style={{ width: 130 }} />
              </Form.Item>
            }
          />
        ),
      },

      {
        name: "departmentId",
        component: <SelectListDepartment placeholder="Department" allowClear />,
      },
      {
        name: "positionId",
        component: <SelectListPosition placeholder="Position" allowClear />,
      },
      {
        name: "created_range_picker",
        component: (
          <DateRangePicker
            format="DD/MM/YYYY"
            placeholder={["Created From Date", "To Date"]}
          />
        ),
      },
      {
        name: "updated_range_picker",
        component: (
          <DateRangePicker
            format="DD/MM/YYYY"
            placeholder={["Update From Date", "To Date"]}
          />
        ),
      },
    ],
    [optionsInput]
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
          <BoxFilter canSearch onReset={handleReset} />
        </div>
      </Form>
    </Card>
  );
};

export default FormFilter;
