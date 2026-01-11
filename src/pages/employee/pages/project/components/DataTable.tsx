/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Avatar, Button, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useProjectContext } from "../ProjectContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { Project, ProjectStatus } from "@/apis/project";

const getStatusColor = (status: ProjectStatus): string => {
    const statusColors: Record<ProjectStatus, string> = {
        PLANNING: "blue",
        IN_PROGRESS: "cyan",
        ON_HOLD: "orange",
        COMPLETED: "green",
        CANCELLED: "red",
    };
    return statusColors[status] || "default";
};

const getStatusLabel = (status: ProjectStatus): string => {
    const statusLabels: Record<ProjectStatus, string> = {
        PLANNING: "Đang lập kế hoạch",
        IN_PROGRESS: "Đang thực hiện",
        ON_HOLD: "Tạm dừng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
    };
    return statusLabels[status] || status;
};

const DataTable = () => {
    const {
        dataResponse,
        isSuccess,
        handleFilterSubmit,
        params,
        setSelectedProject,
    } = useProjectContext();

    const { setListProjectActiveKey, listProjectActiveKey } = useTableStore(
        (state) => state
    );
    const baseColumns: ColumnsType<Project> = useMemo(
        () => [
            {
                title: "STT",
                key: COLUMN_KEYS.NO,
                render: (_, __, index: number) => {
                    const currentPage = dataResponse?.data?.pagination.page ?? 1;
                    const pageSize = dataResponse?.data?.pagination.limit ?? 10;
                    return (currentPage - 1) * pageSize + index + 1;
                },
                width: 80,
                fixed: "left",
                align: "center",
            },
            {
                title: "Tên dự án",
                dataIndex: "name",
                key: COLUMN_KEYS.NAME,
                width: 200,
                align: "left",
                fixed: "left",
                render: (value, record) => (
                    <a
                        href={`/projects/${record.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/projects/${record.id}`;
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {value}
                    </a>
                ),
            },
            {
                title: "Mô tả",
                dataIndex: "description",
                key: COLUMN_KEYS.DESCRIPTION,
                align: "left",
                width: 250,
                render: (value) => <TooltipTruncatedText value={value} />,
            },
            {
                title: "Người quản lý",
                dataIndex: "manager",
                key: COLUMN_KEYS.MANAGER,
                align: "left",
                width: 250,
                render: (_, record) =>
                    record.manager ? (
                        <div className="flex items-center gap-2">
                            <Avatar
                                src={
                                    record.manager?.avatar ??
                                    "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
                                }
                                style={{ flexShrink: 0 }}
                                size={40}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {record.manager?.fullName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {record.manager?.email}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-400">Chưa có</span>
                    ),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: COLUMN_KEYS.STATUS,
                align: "center",
                width: 150,
                render: (value: ProjectStatus) => (
                    <Tag color={getStatusColor(value)}>{getStatusLabel(value)}</Tag>
                ),
            },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: COLUMN_KEYS.START_DATE,
                align: "center",
                width: 150,
                render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: COLUMN_KEYS.END_DATE,
                align: "center",
                width: 150,
                render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
            },
            {
                title: "Ngân sách",
                dataIndex: "budget",
                key: COLUMN_KEYS.BUDGET,
                align: "right",
                width: 150,
                render: (value) =>
                    value
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(Number(value))
                        : "-",
            },
            {
                title: "Số thành viên",
                dataIndex: "members",
                key: COLUMN_KEYS.MEMBER_COUNT,
                width: 150,
                align: "center",
                render: (value) => {
                    return value?.length || 0;
                }
            },
            {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                key: COLUMN_KEYS.CREATED_AT,
                align: "center",
                width: 150,
                render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
            },
            {
                title: "Hành động",
                key: COLUMN_KEYS.ACTION,
                width: 120,
                fixed: "right",
                align: "center",
                render: (_, record) => (
                    <Button
                        type="text"
                        onClick={() => {
                            setSelectedProject(record);
                        }}
                        icon={<EditOutlined style={{ color: "#10b981" }} />}
                    />
                ),
            },
        ],
        [
            dataResponse?.data?.pagination.page,
            dataResponse?.data?.pagination.limit,
            setSelectedProject,
        ]
    );

    useEffect(() => {
        if (!listProjectActiveKey) {
            setListProjectActiveKey(
                baseColumns
                    .map((col) => col.key as string)
                    .filter((key) => key !== COLUMN_KEYS.ACTION)
            );
        }
    }, [baseColumns, setListProjectActiveKey, listProjectActiveKey]);

    const paginationConfig = useMemo(
        () => ({
            total: dataResponse?.data?.pagination.total || 0,
            pageSize: dataResponse?.data?.pagination.limit || 10,
            current: dataResponse?.data?.pagination.page || 1,
            showTotal: (total: number) => (
                <span>
                    <span className="font-bold">Total:</span> {total}
                </span>
            ),
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
        }),
        [
            dataResponse?.data?.pagination.total,
            dataResponse?.data?.pagination.limit,
            dataResponse?.data?.pagination.page,
        ]
    );

    return (
        <TableComponent
            isSuccess={isSuccess}
            rowKey={(record) => record.id || ""}
            dataSource={dataResponse?.data?.data}
            columns={baseColumns}
            scroll={{ x: true }}
            activeKeys={listProjectActiveKey || []}
            setActiveKeys={setListProjectActiveKey}
            pagination={paginationConfig}
            onChange={(p) =>
                handleFilterSubmit?.({
                    ...params,
                    page: p.current,
                    limit: p.pageSize,
                })
            }
            editColumnMode={true}
        />
    );
};

export default DataTable;
