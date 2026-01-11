import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, Input } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useProjectContext } from "../ProjectContext";
import type { GetListProjectRequest } from "@/apis/project/model/Project";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import SelectProjectStatus from "@/components/common/form/SelectProjectStatus";
import dayjs from "dayjs";

interface FormFilterProps {
    onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
    const [form] = Form.useForm();
    const { params, paramsStr, handleFilterSubmit } = useProjectContext();

    useEffect(() => {
        form.resetFields();
    }, [paramsStr, form]);

    const onFinish = useCallback(
        (values: GetListProjectRequest) => {
            const {
                created_range_picker,
                updated_range_picker,
                start_range_picker,
                end_range_picker,
                ...restValues
            } = values as any;
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
                start_date_from: start_range_picker?.[0]
                    ? dayjs(start_range_picker[0]).startOf("day").unix()
                    : undefined,
                start_date_to: start_range_picker?.[1]
                    ? dayjs(start_range_picker[1]).endOf("day").unix()
                    : undefined,
                end_date_from: end_range_picker?.[0]
                    ? dayjs(end_range_picker[0]).startOf("day").unix()
                    : undefined,
                end_date_to: end_range_picker?.[1]
                    ? dayjs(end_range_picker[1]).endOf("day").unix()
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
        return [
            { value: "q", label: "Tên/Mô tả dự án" },
            { value: "name", label: "Tên dự án" },
        ];
    }, []);

    const fields = useMemo(
        () => [
            {
                name: "general_code",
                component: (
                    <Input
                        placeholder="Nhập..."
                        allowClear
                        addonBefore={
                            <Form.Item name="general_code_type" noStyle>
                                <select
                                    style={{
                                        width: 170,
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                    }}
                                >
                                    {optionsInput.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>
                        }
                    />
                ),
            },
            {
                name: "status",
                component: <SelectProjectStatus placeholder="- Chọn trạng thái -" allowClear />,
            },
            {
                name: "managerId",
                component: (
                    <SelectListEmployee placeholder="- Chọn người quản lý -" allowClear />
                ),
            },
            {
                name: "start_range_picker",
                component: (
                    <DateRangePicker
                        format="DD/MM/YYYY"
                        placeholder={["Bắt đầu từ ngày", "Đến ngày"]}
                    />
                ),
            },
            {
                name: "end_range_picker",
                component: (
                    <DateRangePicker
                        format="DD/MM/YYYY"
                        placeholder={["Kết thúc từ ngày", "Đến ngày"]}
                    />
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
        ],
        [optionsInput]
    );

    return (
        <Card className="mb-3 py-1" size="small">
            <Form
                form={form}
                name="project-filter"
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
