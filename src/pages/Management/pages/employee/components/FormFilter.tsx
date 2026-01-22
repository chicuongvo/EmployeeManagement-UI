import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";
import { useUser } from "@/hooks/useUser";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useEmployeeContext } from "../EmployeeContext";
import type { GetListEmployeeRequest } from "@/apis/employee/model/Employee";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListDepartment from "@/components/common/form/SelectListDepartment";
import SelectListPosition from "@/components/common/form/SelectListPosition";
import dayjs from "dayjs";
import { convertToDateRange } from "@/utils/convertToDateRange";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit, tab } = useEmployeeContext();
  const { userProfile } = useUser();

  // Check if user is HR
  const isHR = userProfile?.department?.departmentCode === "HR";

  // Disable department filter if user has department and is not HR
  const isDepartmentFilterDisabled = !isHR && !!userProfile?.department?.id;

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
    [handleFilterSubmit, onSearch],
  );

  const handleReset = useCallback(() => {
    handleFilterSubmit({});
  }, [handleFilterSubmit]);

  const initialValues = useMemo(() => {
    return {
      ...params,
      created_range_picker: convertToDateRange(
        params.created_date_from,
        params.created_date_to,
      ),
      updated_range_picker: convertToDateRange(
        params.updated_date_from,
        params.updated_date_to,
      ),
    };
  }, [params]);

  const optionsInput = useMemo(() => {
    if (tab == "1") {
      return [
        { value: "fullName", label: "Tên" },
        { value: "email", label: "Email" },
        { value: "phone", label: "SĐT" },
        { value: "employeeCode", label: "Mã nhân viên" },
        { value: "citizenId", label: "CCCD" },
      ];
    }
    return [];
  }, [tab]);

  const fields = useMemo(
    () => [
      {
        name: "q",
        component: (
          <Input placeholder="Tìm kiếm theo mã nhân viên hoặc tên" allowClear />
        ),
      },
      {
        name: "general_code",
        component: (
          <Input
            placeholder="Nhập"
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
        component: (
          <SelectListDepartment
            placeholder="- Chọn phòng ban -"
            allowClear
            disabled={isDepartmentFilterDisabled}
          />
        ),
      },
      {
        name: "positionId",
        component: (
          <SelectListPosition placeholder="- Chọn vị trí -" allowClear />
        ),
      },
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
    [optionsInput, isDepartmentFilterDisabled],
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
