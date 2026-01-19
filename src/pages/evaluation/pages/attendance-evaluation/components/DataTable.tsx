/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Avatar, Button, Popconfirm, Progress, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo, useState } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useAttendanceContext } from "../AttendanceContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { AttendanceReportDetail } from "@/apis/attendance/model/Attendance";
import { Link } from "react-router-dom";
import { TABS } from "..";
import type { LeaveApplication } from "@/apis/leave-application/model/LeaveApplication";
import { LeaveApplicationStatus } from "@/components/common/status";
import showMessage from "@/utils/showMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLeaveApplication } from "@/apis/leave-application";

// Exclude columns for leave application tab
const TAB_LEAVE_APPLICATION_EXCLUDE_COLUMNS = [
    COLUMN_KEYS.DEPARTMENT,
    COLUMN_KEYS.POSITION,
    "expectedWorkingDays",
    "leaveDays",
    "overLeaveDays",
    "actualWorkingDays",
    "attendanceRatio",
    "note",
];

// Exclude columns for attendance tab
const TAB_ATTENDANCE_EXCLUDE_COLUMNS = [
    "employee_name",
    "leave_type",
    "start_date",
    "end_date",
    "days",
    "reason",
    "status",
    COLUMN_KEYS.CREATED_AT,
    COLUMN_KEYS.ACTION,
];

const DataTable = () => {
    const { dataResponse, isSuccess, handleFilterSubmit, params, tab, refetch } =
        useAttendanceContext();
    const queryClient = useQueryClient();

    const {
        setListAttendanceActiveKey,
        listAttendanceActiveKey,
        setListLeaveApplicationActiveKey,
        listLeaveApplicationActiveKey,
    } = useTableStore((state) => state);

    const [selectedLeaveApplication, setSelectedLeaveApplication] =
        useState<LeaveApplication | null>(null);

    const deleteLeaveApplicationMutation = useMutation({
        mutationFn: (id: number) => deleteLeaveApplication(id),
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
        },
    });

    const baseColumns: ColumnsType<AttendanceReportDetail | LeaveApplication | any> =
        useMemo(
            () => [
                {
                    title: "STT",
                    key: COLUMN_KEYS.NO,
                    render: (_, __, index: number) => {
                        if (tab === TABS.LEAVE_APPLICATION) {
                            const pagination = (dataResponse as any)?.data?.pagination;
                            const currentPage = pagination?.page ?? 1;
                            const pageSize = pagination?.limit ?? 10;
                            return (currentPage - 1) * pageSize + index + 1;
                        }
                        return index + 1;
                    },
                    width: 80,
                    fixed: "left",
                    align: "center",
                },
                {
                    title: "Mã nhân viên",
                    dataIndex: ["employee", "employeeCode"],
                    key: COLUMN_KEYS.EMPLOYEE_CODE,
                    align: "center",
                    fixed: "left",
                    width: 150,
                    render: (value, record) =>
                        record.employee ? (
                            <Link to={`/employee/employees/${record.employee.id}`}>
                                <span className="text-blue-600 hover:text-blue-800">
                                    {value}
                                </span>
                            </Link>
                        ) : (
                            "-"
                        ),
                },
                {
                    title: "Họ và tên",
                    dataIndex: ["employee", "fullName"],
                    key: COLUMN_KEYS.FULL_NAME,
                    width: 250,
                    align: "left",
                    fixed: "left",
                    render: (_, record) =>
                        record.employee ? (
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={
                                        record.employee.avatar ??
                                        "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
                                    }
                                    size={40}
                                    className="rounded-full"
                                    style={{ flexShrink: 0 }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {record.employee.fullName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {record.employee.email}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            "-"
                        ),
                },
                {
                    title: "Tên nhân viên",
                    dataIndex: ["employee", "name"],
                    key: "employee_name",
                    width: 200,
                    align: "left",
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Phòng ban",
                    dataIndex: ["employee", "department", "name"],
                    key: COLUMN_KEYS.DEPARTMENT,
                    align: "left",
                    width: 180,
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Vị trí",
                    dataIndex: ["employee", "position", "name"],
                    key: COLUMN_KEYS.POSITION,
                    align: "left",
                    width: 180,
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Loại nghỉ phép",
                    dataIndex: ["leaveType", "name"],
                    key: "leave_type",
                    align: "left",
                    width: 180,
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Ngày bắt đầu",
                    dataIndex: "startDate",
                    key: "start_date",
                    align: "center",
                    width: 150,
                    render: (value) => dayjs(value).format("DD/MM/YYYY"),
                },
                {
                    title: "Ngày kết thúc",
                    dataIndex: "endDate",
                    key: "end_date",
                    align: "center",
                    width: 150,
                    render: (value) => dayjs(value).format("DD/MM/YYYY"),
                },
                {
                    title: "Số ngày",
                    key: "days",
                    align: "center",
                    width: 100,
                    render: (_, record) => {
                        const start = dayjs(record.startDate);
                        const end = dayjs(record.endDate);
                        const days = end.diff(start, "day") + 1;
                        return <span>{days} ngày</span>;
                    },
                },
                {
                    title: "Lý do",
                    dataIndex: "reason",
                    key: "reason",
                    align: "left",
                    width: 250,
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Ngày công chuẩn",
                    dataIndex: "expectedWorkingDays",
                    key: "expectedWorkingDays",
                    align: "center",
                    width: 150,
                    render: (value) => <span className="font-medium">{value ?? 26}</span>,
                },
                {
                    title: "Ngày nghỉ phép",
                    dataIndex: "leaveDays",
                    key: "leaveDays",
                    align: "center",
                    width: 140,
                    render: (value) => (
                        <Tag color={value > 0 ? "orange" : "default"}>{value ?? 0}</Tag>
                    ),
                },
                {
                    title: "Nghỉ vượt phép",
                    dataIndex: "overLeaveDays",
                    key: "overLeaveDays",
                    align: "center",
                    width: 140,
                    render: (value) => (
                        <Tag color={value > 0 ? "red" : "default"}>{value ?? 0}</Tag>
                    ),
                },
                {
                    title: "Ngày công thực tế",
                    dataIndex: "actualWorkingDays",
                    key: "actualWorkingDays",
                    align: "center",
                    width: 150,
                    render: (value) => (
                        <span className="font-semibold text-blue-600">{value ?? "-"}</span>
                    ),
                },
                {
                    title: "Độ chuyên cần",
                    dataIndex: "attendanceRatio",
                    key: "attendanceRatio",
                    align: "center",
                    width: 200,
                    render: (value) => {
                        const ratio = value ?? 0;
                        const percentage = Math.round(ratio * 100);

                        let color = "success";
                        if (percentage < 70) color = "exception";
                        else if (percentage < 85) color = "normal";

                        return (
                            <div className="flex flex-col items-center gap-1">
                                <Progress
                                    percent={percentage}
                                    size="small"
                                    status={color as any}
                                    strokeColor={
                                        percentage >= 85
                                            ? "#52c41a"
                                            : percentage >= 70
                                                ? "#faad14"
                                                : "#ff4d4f"
                                    }
                                />
                                <span className="text-xs font-medium">{percentage}%</span>
                            </div>
                        );
                    },
                },
                {
                    title: "Ghi chú",
                    dataIndex: "note",
                    key: "note",
                    align: "left",
                    width: 200,
                    render: (value) => <TooltipTruncatedText value={value} />,
                },
                {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    align: "center",
                    width: 150,
                    render: (value) => <LeaveApplicationStatus status={value} />,
                },
                {
                    title: "Ngày tạo",
                    dataIndex: "createdAt",
                    align: "left",
                    key: COLUMN_KEYS.CREATED_AT,
                    width: 150,
                    render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
                },
                {
                    title: "Hành động",
                    key: COLUMN_KEYS.ACTION,
                    width: 150,
                    fixed: "right",
                    align: "center",
                    render: (_, record) => (
                        <Space>
                            <Button
                                type="text"
                                onClick={() => {
                                    setSelectedLeaveApplication(record);
                                    // You can add edit modal here if needed
                                }}
                                icon={<EditOutlined style={{ color: "#10b981" }} />}
                            />
                            <Popconfirm
                                title="Xóa đơn nghỉ phép"
                                description="Bạn có chắc chắn muốn xóa đơn nghỉ phép này?"
                                onConfirm={() => {
                                    deleteLeaveApplicationMutation.mutate(record.id, {
                                        onSuccess: () => {
                                            showMessage({
                                                level: "success",
                                                title: "Xóa đơn nghỉ phép thành công",
                                            });
                                        },
                                        onError: () => {
                                            showMessage({
                                                level: "error",
                                                title: "Xóa đơn nghỉ phép thất bại",
                                            });
                                        },
                                    });
                                }}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </Space>
                    ),
                },
            ],
            [
                tab,
                dataResponse,
                deleteLeaveApplicationMutation,
                setSelectedLeaveApplication,
            ]
        );

    const columns = useMemo(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            return baseColumns.filter(
                (col) => !TAB_LEAVE_APPLICATION_EXCLUDE_COLUMNS.includes(col.key as any)
            );
        }

        // Attendance tab
        return baseColumns.filter(
            (col) => !TAB_ATTENDANCE_EXCLUDE_COLUMNS.includes(col.key as any)
        );
    }, [baseColumns, tab]);

    useEffect(() => {
        if (tab === TABS.ATTENDANCE && !listAttendanceActiveKey) {
            setListAttendanceActiveKey(
                columns
                    .map((col) => col.key as string)
                    .filter((key) => key !== COLUMN_KEYS.ACTION)
            );
        }
        if (tab === TABS.LEAVE_APPLICATION && !listLeaveApplicationActiveKey) {
            setListLeaveApplicationActiveKey(
                columns
                    .map((col) => col.key as string)
                    .filter((key) => key !== COLUMN_KEYS.ACTION)
            );
        }
    }, [
        columns,
        setListAttendanceActiveKey,
        listAttendanceActiveKey,
        setListLeaveApplicationActiveKey,
        listLeaveApplicationActiveKey,
        tab,
    ]);

    const paginationConfig = useMemo(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            const pagination = (dataResponse as any)?.data?.pagination;
            return {
                total: pagination?.total || 0,
                pageSize: pagination?.limit || 10,
                current: pagination?.page || 1,
                showTotal: (total: number) => (
                    <span>
                        <span className="font-bold">Total:</span> {total}
                    </span>
                ),
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "50", "100"],
            };
        }
        return false;
    }, [dataResponse, tab]);

    const dataSource = useMemo(() => {
        if (tab === TABS.LEAVE_APPLICATION) {
            return (dataResponse as any)?.data?.data;
        }
        return (dataResponse as any)?.data?.details;
    }, [dataResponse, tab]);

    return (
        <TableComponent
            isSuccess={isSuccess}
            rowKey={(record) => record.id?.toString() || ""}
            dataSource={dataSource}
            columns={columns as ColumnsType<AttendanceReportDetail | LeaveApplication | any>}
            scroll={{ x: true }}
            activeKeys={
                tab === TABS.ATTENDANCE
                    ? listAttendanceActiveKey
                    : listLeaveApplicationActiveKey || []
            }
            setActiveKeys={
                tab === TABS.ATTENDANCE
                    ? setListAttendanceActiveKey
                    : setListLeaveApplicationActiveKey
            }
            pagination={paginationConfig}
            onChange={(p) => {
                if (tab === TABS.LEAVE_APPLICATION && p.current && p.pageSize) {
                    handleFilterSubmit?.({
                        ...params,
                        page: p.current,
                        limit: p.pageSize,
                    });
                }
            }}
            editColumnMode={true}
        />
    );
};

export default DataTable;
