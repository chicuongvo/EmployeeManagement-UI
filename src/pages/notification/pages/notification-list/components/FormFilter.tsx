import { useCallback, useMemo } from "react";
import { Card, Form, Input, Select } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useNotificationContext } from "../../../NotificationContext";
import type { GetListNotificationRequest } from "../../../NotificationContext";

interface FormFilterProps {
  onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, handleFilterSubmit } = useNotificationContext();

  const onFinish = useCallback(
    (values: GetListNotificationRequest) => {
      handleFilterSubmit(values);
      if (onSearch) {
        setTimeout(() => onSearch(), 100);
      }
    },
    [handleFilterSubmit, onSearch],
  );

  const handleReset = useCallback(() => {
    handleFilterSubmit({});
  }, [handleFilterSubmit]);

  const fields = useMemo(
    () => [
      {
        name: "search",
        component: <Input placeholder="Tìm kiếm tiêu đề" allowClear />,
      },
      {
        name: "creatorName",
        component: <Input placeholder="Nhập tên người tạo" allowClear />,
      },
      {
        name: "isRead",
        component: (
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            options={[
              { label: "Đã đọc", value: true },
              { label: "Chưa đọc", value: false },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="notification-filter"
        onFinish={onFinish}
        initialValues={params}
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
