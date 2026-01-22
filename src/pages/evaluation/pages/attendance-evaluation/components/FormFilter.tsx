import { useCallback, useEffect, useMemo } from "react";
import { Card, Form, DatePicker } from "antd";

import BoxFilter from "@/components/common/shared/BoxFiltered";
import { useAttendanceContext } from "../AttendanceContext";
import type { GetAttendanceReportRequest } from "@/apis/attendance/model/Attendance";
import type { GetListLeaveApplicationRequest } from "@/apis/leave-application/model/LeaveApplication";
import dayjs from "dayjs";
import { TABS } from "..";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import SelectListEmployee from "@/components/common/form/SelectListEmployee";
import SelectListLeaveType from "@/components/common/form/SelectListLeaveType";
import SelectLeaveApplicationStatus from "@/components/common/form/SelectLeaveApplicationStatus";
import { convertToDateRange } from "@/utils/convertToDateRange";

interface FormFilterProps {
    onSearch?: () => void;
}

const FormFilter = ({ onSearch }: FormFilterProps) => {
    const [form] = Form.useForm();
    const { params, paramsStr, handleFilterSubmit, tab } = useAttendanceContext();

    useEffect(() => {
        form.resetFields();
    }, [paramsStr, form, tab]);

    const onFinish = useCallback(
        (values: (GetAttendanceReportRequest | GetListLeaveApplicationRequest) & {
            monthYear?: dayjs.Dayjs;
            date_range_picker?: [dayjs.Dayjs, dayjs.Dayjs];
        }) => {
            if (tab === TABS.LEAVE_APPLICATION) {
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
            } else {
                const { monthYear } = values;
                handleFilterSubmit({
                    month: monthYear ? monthYear.month() + 1 : new Date().getMonth() + 1,
                    year: monthYear ? monthYear.year() : new Date().getFullYear(),
                });
            }

            if (onSearch) {
                setTimeout(() => onSearch(), 100);
            }
        },
        [handleFilterSubmit, onSearch, tab]
    );

    const handleReset = useCallback(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            handleFilterSubmit({});
        } else {
            handleFilterSubmit({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            });
        }
    }, [handleFilterSubmit, tab]);

    const initialValues = useMemo(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            const leaveParams = params as GetListLeaveApplicationRequest;
            return {
                ...leaveParams,
                date_range_picker: convertToDateRange(
                    leaveParams.startDate ? dayjs(leaveParams.startDate).unix() : undefined,
                    leaveParams.endDate ? dayjs(leaveParams.endDate).unix() : undefined
                ),
            };
        }
        const attendanceParams = params as GetAttendanceReportRequest;
        return {
            monthYear: dayjs()
                .month((attendanceParams.month ?? new Date().getMonth() + 1) - 1)
                .year(attendanceParams.year ?? new Date().getFullYear()),
        };
    }, [params, tab]);

    const fields = useMemo(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            return [
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
                    name: "employeeId",
                    component: (
                        <SelectListEmployee placeholder="- Chọn nhân viên -" allowClear />
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
            ];
        }

        return [
            {
                name: "monthYear",
                label: "Tháng/Năm",
                component: (
                    <DatePicker
                        picker="month"
                        format="MM/YYYY"
                        placeholder="Chọn tháng"
                        className="w-full"
                        allowClear={false}
                    />
                ),
            },
        ];
    }, [tab]);

    return (
        <Card className="mb-3 py-1" size="small">
            <Form
                form={form}
                name={tab === TABS.LEAVE_APPLICATION ? "leave-application-filter" : "attendance-filter"}
                onFinish={onFinish}
                initialValues={initialValues}
                scrollToFirstError
            >
                <div className="grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
                    {fields.map(({ name, label, component }) => (
                        <Form.Item key={name} name={name} label={label} className="mb-0">
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
