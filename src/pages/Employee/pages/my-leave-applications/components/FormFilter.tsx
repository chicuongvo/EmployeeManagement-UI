import { useCallback, useEffect, useMemo } from "react";
import { Card, Form } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useMyLeaveApplicationContext } from "../MyLeaveApplicationContext";
import type { GetListLeaveApplicationRequest } from "@/apis/leave-application/model/LeaveApplication";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListLeaveType from "@/components/common/form/SelectListLeaveType";
import SelectLeaveApplicationStatus from "@/components/common/form/SelectLeaveApplicationStatus";
import dayjs from "dayjs";
import { convertToDateRange } from "@/utils/convertToDateRange";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit } =
    useMyLeaveApplicationContext();

  useEffect(() => {
    form.resetFields();
  }, [paramsStr, form]);

  const onFinish = useCallback(
    (values: GetListLeaveApplicationRequest & { date_range_picker?: [dayjs.Dayjs, dayjs.Dayjs] }) => {
      const { date_range_picker, ...restValues } = values;
      handleFilterSubmit({
        ...restValues,
        startDate: date_range_picker?.[0]
          ? dayjs(date_range_picker[0]).format("YYYY-MM-DD")
          : undefined,
        endDate: date_range_picker?.[1]
          ? dayjs(date_range_picker[1]).format("YYYY-MM-DD")
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
      date_range_picker: convertToDateRange(
        params.startDate ? dayjs(params.startDate).unix() : undefined,
        params.endDate ? dayjs(params.endDate).unix() : undefined
      ),
    };
  }, [params]);

  const fields = useMemo(
    () => [
      {
        name: "status",
        component: (
          <SelectLeaveApplicationStatus
            placeholder="- Chọn trạng thái -"
            allowClear
          />
        ),
      },
      {
        name: "leaveTypeId",
        component: (
          <SelectListLeaveType placeholder="- Chọn loại nghỉ phép -" allowClear />
        ),
      },
      {
        name: "date_range_picker",
        component: (
          <DateRangePicker
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        ),
      },
    ],
    []
  );

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="my-leave-application-filter"
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
