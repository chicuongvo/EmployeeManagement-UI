import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Select } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useUpdateRequestContext } from "../UpdateRequestContext";
import type { UpdateRequestQueryParams } from "@/types/UpdateRequest";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import { useUser } from "@/hooks/useUser";

interface FormFilterProps {
  onSearch?: () => void;
  isMyRequests?: boolean;
}

const FormFilter = ({ onSearch, isMyRequests = false }: FormFilterProps) => {
  const [form] = Form.useForm();
  const { params, paramsStr, handleFilterSubmit } = useUpdateRequestContext();
  const { userProfile } = useUser();

  useEffect(() => {
    form.resetFields();
  }, [paramsStr, form]);

  const onFinish = useCallback(
    (values: UpdateRequestQueryParams) => {
      const finalValues: UpdateRequestQueryParams = {
        ...values,
        ...(isMyRequests && userProfile?.id
          ? { requestedById: userProfile.id }
          : {}),
      };

      handleFilterSubmit(finalValues);

      if (onSearch) {
        setTimeout(() => onSearch(), 100);
      }
    },
    [handleFilterSubmit, onSearch, isMyRequests, userProfile?.id]
  );

  const handleReset = useCallback(() => {
    if (isMyRequests && userProfile?.id) {
      handleFilterSubmit({
        requestedById: userProfile.id,
      });
    } else {
      handleFilterSubmit({});
    }
  }, [handleFilterSubmit, isMyRequests, userProfile?.id]);

  const initialValues = useMemo(() => {
    return {
      ...params,
      ...(isMyRequests && userProfile?.id
        ? { requestedById: userProfile.id }
        : {}),
    };
  }, [params, isMyRequests, userProfile?.id]);

  return (
    <Card className="mb-3 py-1" size="small">
      <Form
        form={form}
        name="update-request-filter"
        onFinish={onFinish}
        initialValues={initialValues}
        scrollToFirstError
      >
        <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
          <Form.Item name="status" className="mb-0">
            <Select placeholder="Trạng thái" allowClear>
              <Select.Option value="PENDING">Chờ duyệt</Select.Option>
              <Select.Option value="APPROVED">Đã duyệt</Select.Option>
              <Select.Option value="NOT_APPROVED">Từ chối</Select.Option>
            </Select>
          </Form.Item>

          {!isMyRequests && (
            <Form.Item name="requestedById" className="mb-0">
              <SelectListEmployee
                placeholder="Chọn người yêu cầu"
                allowClear
              />
            </Form.Item>
          )}

          <Form.Item name="reviewedById" className="mb-0">
            <SelectListEmployee
              placeholder="Chọn người duyệt"
              allowClear
            />
          </Form.Item>
        </div>

        <div className="pt-2 flex gap-4 justify-end">
          <BoxFilter canSearch onReset={handleReset} />
        </div>
      </Form>
    </Card>
  );
};

export default FormFilter;

