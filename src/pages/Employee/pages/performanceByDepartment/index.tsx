import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, DatePicker, Card, Avatar, Tag, Empty, Result, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

import PageTitle from "@/components/common/shared/PageTitle";
import TableComponent from "@/components/common/table/TableComponent";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import {
    performanceService,
    type DepartmentPerformanceDetail,
} from "@/apis/performance/performanceService";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import useTableStore from "@/stores/tableStore";
import { useUser } from "@/hooks/useUser";

interface DepartmentInfo {
    id: number;
    name: string;
    departmentCode: string;
    manager: {
        id: number;
        fullName: string;
        avatar: string | null;
    } | null;
}

export default function PerformanceByDepartmentPage() {
    const navigate = useNavigate();
    const { userProfile, isLoading: isLoadingUser } = useUser();

    // Lấy departmentId từ user đang login
    const departmentId = userProfile?.department?.id;

    const [department, setDepartment] = useState<DepartmentInfo | null>(null);
    const [details, setDetails] = useState<DepartmentPerformanceDetail[]>([]);
    const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filter state - default to current month/year
    const [filterMonth, setFilterMonth] = useState<number>(dayjs().month() + 1);
    const [filterYear, setFilterYear] = useState<number>(dayjs().year());

    const {
        listPerformanceByDepartmentActiveKey,
        setListPerformanceByDepartmentActiveKey,
    } = useTableStore((state) => state);

    useEffect(() => {
        if (departmentId && filterMonth && filterYear) {
            fetchData();
        }
    }, [departmentId, filterMonth, filterYear]);

    useEffect(() => {
        fetchCriteria();
    }, []);

    const fetchCriteria = async () => {
        try {
            const criteriaData = await performanceCriteriaService.getAll();
            setCriteria(criteriaData);
        } catch (error) {
            console.error("Failed to fetch criteria:", error);
        }
    };

    const fetchData = async () => {
        if (!departmentId) return;
        
        try {
            setIsLoading(true);
            const deptId = departmentId;

            const performanceData = await performanceService.getByDepartmentId(
                deptId,
                filterMonth,
                filterYear
            );

            setDepartment(performanceData.department);
            setDetails(performanceData.report?.details || []);
        } catch (error) {
            console.error("Failed to fetch department performance:", error);
            toast.error("Không thể tải dữ liệu đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    const formatScore = (score: number | null) => {
        return score !== null ? score.toFixed(1) : "-";
    };

    const getScoreByCriteriaId = (
        detail: DepartmentPerformanceDetail,
        criteriaId: number
    ): number | null => {
        if (!detail.scores) return null;
        const scoreObj = detail.scores.find(
            (s) => s.performanceCriteriaId === criteriaId
        );
        return scoreObj ? scoreObj.score : null;
    };

    // Build columns dynamically
    const columns: ColumnsType<DepartmentPerformanceDetail> = useMemo(() => {
        const fixedColumns: ColumnsType<DepartmentPerformanceDetail> = [
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
                title: "Mã NV",
                key: "employeeCode",
                width: 100,
                fixed: "left",
                align: "left",
                render: (_, record) => (
                    <TooltipTruncatedText
                        value={record.employee?.employeeCode || "N/A"}
                    />
                ),
            },
            {
                title: "Nhân viên",
                key: "employeeName",
                fixed: "left",
                width: 250,
                render: (_, record) => (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={record.employee?.avatar}
                            icon={<UserOutlined />}
                            size="small"
                        />
                        <div className="flex flex-col">
                            <span
                                className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={() =>
                                    navigate(
                                        `/employee/performance/employee/${record.employeeId}`
                                    )
                                }
                            >
                                {record.employee?.fullName || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {record.employee?.email || ""}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                title: "Chức vụ",
                key: "position",
                width: 150,
                render: (_, record) => (
                    <TooltipTruncatedText
                        value={record.employee?.position?.name || "N/A"}
                    />
                ),
            },
        ];

        const criteriaColumns: ColumnsType<DepartmentPerformanceDetail> = criteria.map(
            (c) => ({
                title: c.name,
                key: `criteria_${c.id}`,
                align: "center" as const,
                width: 120,
                render: (_, record) => formatScore(getScoreByCriteriaId(record, c.id)),
            })
        );

        const actionColumns: ColumnsType<DepartmentPerformanceDetail> = [
            {
                title: "Điểm TB",
                key: "averageScore",
                align: "center",
                width: 100,
                render: (_, record) => {
                    const score = record.average_score;
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
                width: 180,
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
        ];

        return [...fixedColumns, ...criteriaColumns, ...actionColumns];
    }, [criteria, currentPage, pageSize, navigate]);

    useEffect(() => {
        if (!listPerformanceByDepartmentActiveKey) {
            setListPerformanceByDepartmentActiveKey(
                columns
                    .map((col) => col.key as string)
                    .filter((key) => key !== "action")
            );
        }
    }, [columns, setListPerformanceByDepartmentActiveKey, listPerformanceByDepartmentActiveKey]);

    const paginationConfig = useMemo(
        () => ({
            total: details.length,
            pageSize: pageSize,
            current: currentPage,
            showTotal: (total: number) => (
                <span>
                    <span className="font-bold">Tổng:</span> {total} nhân viên
                </span>
            ),
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
        }),
        [details.length, pageSize, currentPage]
    );

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const tabs: TabsProps["items"] = [
        {
            key: "1",
            label: department
                ? `Đánh giá phòng ${department.name} - ${filterMonth}/${filterYear}`
                : "Đánh giá theo phòng ban",
        },
    ];

    // Hiển thị loading khi đang tải thông tin user
    if (isLoadingUser) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Spin size="large" tip="Đang tải..." />
                </div>
            </PageContainer>
        );
    }

    // Hiển thị thông báo nếu user không có phòng ban
    if (!departmentId) {
        return (
            <PageContainer
                title={<PageTitle title="Đánh giá theo phòng ban" />}
            >
                <Result
                    status="warning"
                    title="Không có phòng ban"
                    subTitle="Bạn chưa được gán vào phòng ban nào. Vui lòng liên hệ quản trị viên."
                />
            </PageContainer>
        );
    }

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
                            title: department?.name || "Department",
                        },
                    ],
                },
            }}
            title={
                <PageTitle
                    title={
                        department
                            ? `Đánh giá phòng ${department.name}`
                            : "Đánh giá theo phòng ban"
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
                            {/* Department Info Card */}
                            {department && (
                                <Card className="mb-4" size="small">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                            <TeamOutlined className="text-2xl text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">
                                                {department.name}
                                            </h3>
                                            <p className="text-gray-500">
                                                Mã phòng: {department.departmentCode}
                                            </p>
                                            {department.manager && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-gray-500">
                                                        Trưởng phòng:
                                                    </span>
                                                    <Avatar
                                                        src={department.manager.avatar}
                                                        icon={<UserOutlined />}
                                                        size="small"
                                                    />
                                                    <span className="font-medium">
                                                        {department.manager.fullName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <Tag color="blue" className="text-lg px-3 py-1">
                                                {filterMonth}/{filterYear}
                                            </Tag>
                                            <p className="text-gray-500 mt-2">
                                                {details.length} nhân viên được đánh giá
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Filter */}
                            <Card className="mb-3 py-1" size="small">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">Lọc theo tháng/năm:</span>
                                    <DatePicker
                                        picker="month"
                                        placeholder="Chọn tháng"
                                        value={dayjs()
                                            .year(filterYear)
                                            .month(filterMonth - 1)}
                                        onChange={(date) => {
                                            if (date) {
                                                setFilterMonth(date.month() + 1);
                                                setFilterYear(date.year());
                                                setCurrentPage(1);
                                            }
                                        }}
                                        format="MM/YYYY"
                                    />
                                </div>
                            </Card>

                            {/* Table or Empty */}
                            {details.length === 0 && !isLoading ? (
                                <Card>
                                    <Empty
                                        description={
                                            <span>
                                                Không có dữ liệu đánh giá cho tháng{" "}
                                                {filterMonth}/{filterYear}
                                            </span>
                                        }
                                    />
                                </Card>
                            ) : (
                                <TableComponent
                                    isSuccess={!isLoading}
                                    rowKey={(record) => record.id?.toString() || ""}
                                    dataSource={details.slice(
                                        (currentPage - 1) * pageSize,
                                        currentPage * pageSize
                                    )}
                                    columns={columns}
                                    scroll={{ x: true }}
                                    activeKeys={listPerformanceByDepartmentActiveKey}
                                    setActiveKeys={setListPerformanceByDepartmentActiveKey}
                                    pagination={paginationConfig}
                                    onChange={handleTableChange}
                                    editColumnMode={false}
                                />
                            )}
                        </>
                    ),
                    label: tabItem.label,
                }))}
            />
        </PageContainer>
    );
}
