import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useEmployeeDetailContext } from "../EmployeeDetailContex";
import { useGetWorkHistoryList } from "@/apis/workHistory/getWorkHistory";
import type { WORK_HISTORY } from "@/apis/workHistory/model/WorkHistory";
import { Link } from "react-router-dom";
import CopyTextPopover from "@/components/common/shared/CopyTextPopover";

const WorkHistoryTable = () => {
    const { employee } = useEmployeeDetailContext();

    const { data: workHistoryData, isLoading } = useGetWorkHistoryList({
        employeeId: employee?.id,
        page: 1,
        limit: 100,
    });

    const columns: ColumnsType<WORK_HISTORY> = useMemo(
        () => [
            {
                title: "STT",
                key: "no",
                render: (_, __, index: number) => index + 1,
                width: 60,
                align: "center",
            },
            {
                title: "Phòng ban",
                dataIndex: ["department"],
                key: "department",
                width: 200,
                render: (department) => (
                    <div className="flex flex-col">
                        <Link
                            to={`/management/departments/${department.id}`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <CopyTextPopover text={department.departmentCode} />
                        </Link>
                        <span className="text-xs text-gray-500">{department.name}</span>
                    </div>
                ),
            },
            {
                title: "Chức vụ",
                dataIndex: ["position", "name"],
                key: "position",
                width: 180,
                align: "left",
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
                width: 150,
                align: "center",
                render: (value) => dayjs(value).format("DD/MM/YYYY"),
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                width: 150,
                align: "center",
                render: (value) =>
                    value ? (
                        dayjs(value).format("DD/MM/YYYY")
                    ) : (
                        <Tag color="green">Đang làm việc</Tag>
                    ),
            },
            {
                title: "Thời gian",
                key: "duration",
                width: 120,
                align: "center",
                render: (_, record) => {
                    const start = dayjs(record.startDate);
                    const end = record.endDate ? dayjs(record.endDate) : dayjs();
                    const months = end.diff(start, "month");
                    const years = Math.floor(months / 12);
                    const remainingMonths = months % 12;

                    if (years > 0) {
                        return `${years} năm ${remainingMonths > 0 ? `${remainingMonths} tháng` : ""}`;
                    }
                    return `${months} tháng`;
                },
            },
            {
                title: "Ghi chú",
                dataIndex: "note",
                key: "note",
                width: 150,
                align: "left",
                render: (value) => value || "-",
            },
        ],
        []
    );

    const dataSource = useMemo(() => {
        return workHistoryData?.data?.data || [];
    }, [workHistoryData]);

    return (
        <div className="px-6 py-4">
            <Table
                loading={isLoading}
                rowKey={(record) => record.id}
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: true }}
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    );
};

export default WorkHistoryTable;