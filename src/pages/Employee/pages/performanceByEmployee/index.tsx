import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, DatePicker, Card, Avatar, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

import PageTitle from "@/components/common/shared/PageTitle";
import TableComponent from "@/components/common/table/TableComponent";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import {
    performanceService,
    type EmployeePerformanceItem,
} from "@/apis/performance/performanceService";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import useTableStore from "@/stores/tableStore";

interface EmployeeInfo {
    id: number;
    employeeCode: string;
    fullName: string;
    avatar: string | null;
    email: string;
    phone: string;
    departmentId: number;
    positionId: number;
    department: { id: number; name: string } | null;
    position: { id: number; name: string } | null;
}

export default function PerformanceByEmployeePage() {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
    const [performanceHistory, setPerformanceHistory] = useState<EmployeePerformanceItem[]>([]);
    const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter state
    const [filterYear, setFilterYear] = useState<number | undefined>(undefined);

    const {
        listPerformanceByEmployeeActiveKey,
        setListPerformanceByEmployeeActiveKey,
    } = useTableStore((state) => state);

    useEffect(() => {
        if (employeeId) {
            fetchData();
        }
    }, [employeeId, filterYear]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const empId = parseInt(employeeId!);

            const [performanceData, criteriaData] = await Promise.all([
                performanceService.getByEmployeeId(empId, undefined, filterYear),
                performanceCriteriaService.getAll(),
            ]);

            setEmployee(performanceData.employee);
            setPerformanceHistory(performanceData.performanceHistory || []);
            setCriteria(criteriaData);
        } catch (error) {
            console.error("Failed to fetch employee performance:", error);
            toast.error("Không thể tải dữ liệu đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    const formatScore = (score: number | null) => {
        return score !== null ? score.toFixed(1) : "-";
    };

    const getScoreByCriteriaId = (
        item: EmployeePerformanceItem,
        criteriaId: number
    ): number | null => {
        if (!item.scores) return null;
        const scoreObj = item.scores.find(
            (s) => s.performanceCriteriaId === criteriaId
        );
        return scoreObj ? scoreObj.score : null;
    };

    // Build columns dynamically
    const columns: ColumnsType<EmployeePerformanceItem> = useMemo(() => {
        const fixedColumns: ColumnsType<EmployeePerformanceItem> = [
            {
                title: "No",
                key: "no",
                render: (_, __, index: number) => {
                    return (currentPage - 1) * pageSize + index + 1;
                },
                width: 60,
                fixed: "left",
                align: "center",
            },
            {
                title: "Tháng/Năm",
                key: "monthYear",
                width: 120,
                fixed: "left",
                align: "center",
                render: (_, record) => (
                    <Tag color="blue">
                        {record.month}/{record.year}
                    </Tag>
                ),
            },
        ];

        const criteriaColumns: ColumnsType<EmployeePerformanceItem> = criteria.map(
            (c) => ({
                title: c.name,
                key: `criteria_${c.id}`,
                align: "center" as const,
                width: 120,
                render: (_, record) => formatScore(getScoreByCriteriaId(record, c.id)),
            })
        );

        const actionColumns: ColumnsType<EmployeePerformanceItem> = [
            {
                title: "Điểm TB",
                key: "averageScore",
                align: "center",
                width: 100,
                render: (_, record) => {
                    const score = record.averageScore;
                    let color = "default";
                    if (score !== null) {
                        if (score >= 1.1) color = "green";
                        else if (score >= 1.0) color = "blue";
                        else if (score >= 0.8) color = "orange";
                        else color = "red";
                    }
                    return (
                        <Tag color={color}>
                            {score !== null ? score.toFixed(2) : "-"}
                        </Tag>
                    );
                },
            },
            {
                title: "Người đánh giá",
                key: "supervisor",
                width: 200,
                render: (_, record) => (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={record.supervisor?.avatar}
                            icon={<UserOutlined />}
                            size="small"
                        />
                        <TooltipTruncatedText
                            value={record.supervisor?.fullName || "N/A"}
                        />
                    </div>
                ),
            },
            {
                title: "Ngày tạo",
                key: "createdAt",
                width: 120,
                align: "center",
                render: (_, record) =>
                    dayjs(record.createdAt).format("DD/MM/YYYY"),
            },
        ];

        return [...fixedColumns, ...criteriaColumns, ...actionColumns];
    }, [criteria, currentPage, pageSize]);

    useEffect(() => {
        if (!listPerformanceByEmployeeActiveKey) {
            setListPerformanceByEmployeeActiveKey(
                columns
                    .map((col) => col.key as string)
                    .filter((key) => key !== "action")
            );
        }
    }, [columns, setListPerformanceByEmployeeActiveKey, listPerformanceByEmployeeActiveKey]);

    const paginationConfig = useMemo(
        () => ({
            total: performanceHistory.length,
            pageSize: pageSize,
            current: currentPage,
            showTotal: (total: number) => (
                <span>
                    <span className="font-bold">Tổng:</span> {total}
                </span>
            ),
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
        }),
        [performanceHistory.length, pageSize, currentPage]
    );

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const tabs: TabsProps["items"] = [
        {
            key: "1",
            label: employee
                ? `Lịch sử đánh giá - ${employee.fullName}`
                : "Lịch sử đánh giá",
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        { title: "Master list" },
                        {
                            title: "Performance",
                            onClick: () => navigate("/employee/performance"),
                            className: "cursor-pointer hover:text-blue-600",
                        },
                        {
                            title: employee?.fullName || "Employee",
                        },
                    ],
                },
            }}
            title={
                <PageTitle
                    title={
                        employee
                            ? `Đánh giá của ${employee.fullName}`
                            : "Đánh giá nhân viên"
                    }
                />
            }
        >
            <Tabs
                type="card"
                activeKey="1"
                className="tag-ticket-list report-tab"
                items={tabs.map((tabItem) => ({
                    key: tabItem.key,
                    children: (
                        <>
                            {/* Employee Info Card */}
                            {employee && (
                                <Card className="mb-4" size="small">
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            src={employee.avatar}
                                            icon={<UserOutlined />}
                                            size={64}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">
                                                {employee.fullName}
                                            </h3>
                                            <p className="text-gray-500">
                                                {employee.employeeCode} -{" "}
                                                {employee.email}
                                            </p>
                                            <div className="flex gap-4 mt-1">
                                                <Tag color="blue">
                                                    {employee.department?.name ||
                                                        "Chưa có phòng ban"}
                                                </Tag>
                                                <Tag color="green">
                                                    {employee.position?.name ||
                                                        "Chưa có chức vụ"}
                                                </Tag>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Filter */}
                            <Card className="mb-3 py-1" size="small">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">Lọc theo năm:</span>
                                    <DatePicker
                                        picker="year"
                                        placeholder="Chọn năm"
                                        value={filterYear ? dayjs().year(filterYear) : null}
                                        onChange={(date) => {
                                            setFilterYear(date ? date.year() : undefined);
                                            setCurrentPage(1);
                                        }}
                                        allowClear
                                    />
                                </div>
                            </Card>

                            {/* Table */}
                            <TableComponent
                                isSuccess={!isLoading}
                                rowKey={(record) => record.reportId?.toString() || ""}
                                dataSource={performanceHistory.slice(
                                    (currentPage - 1) * pageSize,
                                    currentPage * pageSize
                                )}
                                columns={columns}
                                scroll={{ x: true }}
                                activeKeys={listPerformanceByEmployeeActiveKey}
                                setActiveKeys={setListPerformanceByEmployeeActiveKey}
                                pagination={paginationConfig}
                                onChange={handleTableChange}
                                editColumnMode={false}
                            />
                        </>
                    ),
                    label: tabItem.label,
                }))}
            />
        </PageContainer>
    );
}
