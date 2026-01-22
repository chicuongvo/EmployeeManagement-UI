import { useState, useEffect, useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, DatePicker, Card, Avatar, Tag, Empty, Spin, Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

import PageTitle from "@/components/common/shared/PageTitle";
import TableComponent from "@/components/common/table/TableComponent";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import ViewPerformanceDetailDialog from "@/pages/employee/pages/performanceDetail/components/ViewPerformanceDetailDialog";
import {
    performanceService,
    type EmployeePerformanceItem,
} from "@/apis/performance/performanceService";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import type { PerformanceDetail } from "@/apis/performance/model/Performance";
import useTableStore from "@/stores/tableStore";
import { useUser } from "@/hooks/useUser";

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

export default function MyPerformancePage() {
    const { userProfile, isLoading: isLoadingUser } = useUser();

    const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
    const [performanceHistory, setPerformanceHistory] = useState<EmployeePerformanceItem[]>([]);
    const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // View detail modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<PerformanceDetail | null>(null);

    // Filter state
    const [filterYear, setFilterYear] = useState<number | undefined>(undefined);

    const {
        listMyPerformanceActiveKey,
        setListMyPerformanceActiveKey,
    } = useTableStore((state) => state);

    useEffect(() => {
        if (userProfile?.id) {
            fetchData();
        }
    }, [userProfile?.id, filterYear]);

    const fetchData = async () => {
        if (!userProfile?.id) return;
        
        try {
            setIsLoading(true);

            const [performanceData, criteriaData] = await Promise.all([
                performanceService.getByEmployeeId(userProfile.id, undefined, filterYear),
                performanceCriteriaService.getAll(),
            ]);

            setEmployee(performanceData.employee);
            setPerformanceHistory(performanceData.performanceHistory || []);
            setCriteria(criteriaData);
        } catch (error) {
            console.error("Failed to fetch my performance:", error);
            toast.error("Không thể tải dữ liệu đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    const formatScore = (score: number | null | undefined) => {
        return score != null ? score.toFixed(1) : "-";
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

    const handleViewDetail = (record: EmployeePerformanceItem) => {
        // Transform EmployeePerformanceItem to PerformanceDetail format
        const detail: any = {
            id: record.detailId || 0,
            employeeId: userProfile?.id || 0,
            supervisorId: record.supervisorId || 0,
            performanceReportId: record.reportId || 0,
            average_score: record.averageScore,
            employee: userProfile,
            supervisor: record.supervisor,
            scores: record.scores || [],
        };
        setSelectedDetail(detail);
        setViewModalOpen(true);
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
                    if (score != null) {
                        if (score >= 1.1) color = "green";
                        else if (score >= 1.0) color = "blue";
                        else if (score >= 0.8) color = "orange";
                        else color = "red";
                    }
                    return (
                        <Tag color={color}>
                            {score != null ? score.toFixed(2) : "-"}
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
            {
                title: "Hành động",
                key: "action",
                width: 100,
                align: "center",
                fixed: "right",
                render: (_, record) => (
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                            className="text-blue-500 hover:text-blue-600"
                        />
                    </Tooltip>
                ),
            },
        ];

        return [...fixedColumns, ...criteriaColumns, ...actionColumns];
    }, [criteria, currentPage, pageSize]);

    useEffect(() => {
        if (!listMyPerformanceActiveKey) {
            setListMyPerformanceActiveKey(
                columns
                    .map((col) => col.key as string)
                    .filter((key) => key !== "action")
            );
        }
    }, [columns, setListMyPerformanceActiveKey, listMyPerformanceActiveKey]);

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

    // Loading state when user profile is being fetched
    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    // If no user profile, show message
    if (!userProfile) {
        return (
            <PageContainer
                header={{
                    breadcrumb: {
                        items: [
                            { title: "Hồ sơ nhân viên" },
                            { title: "Đánh giá của tôi" },
                        ],
                    },
                }}
                title={<PageTitle title="Đánh giá của tôi" />}
            >
                <Card>
                    <Empty description="Vui lòng đăng nhập để xem đánh giá của bạn" />
                </Card>
            </PageContainer>
        );
    }

    const tabs: TabsProps["items"] = [
        {
            key: "1",
            label: "Lịch sử đánh giá của tôi",
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        { title: "Hồ sơ nhân viên" },
                        { title: "Đánh giá của tôi" },
                    ],
                },
            }}
            title={<PageTitle title="Đánh giá của tôi" />}
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
                            <Card className="mb-4" size="small">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src={userProfile.avatar || employee?.avatar}
                                        icon={<UserOutlined />}
                                        size={64}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">
                                            {userProfile.fullName}
                                        </h3>
                                        <p className="text-gray-500">
                                            {userProfile.employeeCode} - {userProfile.email}
                                        </p>
                                        <div className="flex gap-4 mt-1">
                                            <Tag color="blue">
                                                {userProfile.department?.name || "Chưa có phòng ban"}
                                            </Tag>
                                            <Tag color="green">
                                                {userProfile.position?.name || "Chưa có chức vụ"}
                                            </Tag>
                                        </div>
                                    </div>
                                </div>
                            </Card>

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

                            {/* Table or Empty */}
                            {performanceHistory.length === 0 && !isLoading ? (
                                <Card>
                                    <Empty
                                        description={
                                            <span>
                                                Chưa có dữ liệu đánh giá
                                                {filterYear && ` cho năm ${filterYear}`}
                                            </span>
                                        }
                                    />
                                </Card>
                            ) : (
                                <TableComponent
                                    isSuccess={!isLoading}
                                    rowKey={(record) => record.reportId?.toString() || ""}
                                    dataSource={performanceHistory.slice(
                                        (currentPage - 1) * pageSize,
                                        currentPage * pageSize
                                    )}
                                    columns={columns}
                                    scroll={{ x: true }}
                                    activeKeys={listMyPerformanceActiveKey}
                                    setActiveKeys={setListMyPerformanceActiveKey}
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
            
            {/* View Detail Modal */}
            <ViewPerformanceDetailDialog
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                detail={selectedDetail}
                onUpdate={fetchData}
            />
        </PageContainer>
    );
}
