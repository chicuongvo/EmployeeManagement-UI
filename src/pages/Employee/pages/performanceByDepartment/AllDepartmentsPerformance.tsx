import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import {
    Card,
    DatePicker,
    Empty,
    Spin,
    Tag,
    Avatar,
    Row,
    Col,
    Statistic,
    Progress,
    Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    TeamOutlined,
    UserOutlined,
    TrophyOutlined,
    RiseOutlined,
    FallOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

import PageTitle from "@/components/common/shared/PageTitle";
import { getListDepartment } from "@/apis/department/getListDepartment";
import type { DEPARTMENT } from "@/apis/department/model/Department";
import { performanceService } from "@/apis/performance/performanceService";

interface DepartmentPerformanceSummary {
    department: DEPARTMENT;
    month: number;
    year: number;
    totalDepartmentEmployees: number; // Tổng số NV của phòng ban
    employeesInReport: number; // Số NV có trong báo cáo đánh giá
    employeesWithScore: number; // Số NV đã có điểm
    averageScore: number | null;
    details: Array<{
        employeeId: number;
        employeeName: string;
        averageScore: number | null;
    }>;
}

export default function AllDepartmentsPerformancePage() {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState<DEPARTMENT[]>([]);
    const [performanceData, setPerformanceData] = useState<
        DepartmentPerformanceSummary[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] =
        useState<DepartmentPerformanceSummary | null>(null);

    // Filter state - default to current month/year
    const [filterMonth, setFilterMonth] = useState<number>(dayjs().month() + 1);
    const [filterYear, setFilterYear] = useState<number>(dayjs().year());

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (departments.length > 0) {
            fetchAllDepartmentsPerformance();
        }
    }, [departments, filterMonth, filterYear]);

    const fetchDepartments = async () => {
        try {
            const response = await getListDepartment({ page: 1, limit: 100 });
            setDepartments(response.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            toast.error("Không thể tải danh sách phòng ban");
        }
    };

    const fetchAllDepartmentsPerformance = async () => {
        setIsLoading(true);
        try {
            const promises = departments.map(async (dept) => {
                try {
                    const data = await performanceService.getByDepartmentId(
                        dept.id,
                        filterMonth,
                        filterYear
                    );

                    const details = data.report?.details || [];
                    
                    // Tính điểm TB cho từng nhân viên từ scores array nếu average_score là null
                    const detailsWithScore = details.map((d) => {
                        let avgScore = d.average_score;
                        // Nếu chưa có average_score, tính từ scores array
                        if (avgScore == null && d.scores && d.scores.length > 0) {
                            const totalScore = d.scores.reduce((sum, s) => sum + s.score, 0);
                            avgScore = totalScore / d.scores.length;
                        }
                        return {
                            ...d,
                            calculatedScore: avgScore,
                        };
                    });

                    const validScores = detailsWithScore
                        .map((d) => d.calculatedScore)
                        .filter((s): s is number => s != null);
                    const deptAvgScore =
                        validScores.length > 0
                            ? validScores.reduce((a, b) => a + b, 0) / validScores.length
                            : null;

                    return {
                        department: dept,
                        month: filterMonth,
                        year: filterYear,
                        totalDepartmentEmployees: dept.employees?.length || 0, // Tổng NV phòng ban
                        employeesInReport: details.length, // Số NV trong báo cáo
                        employeesWithScore: validScores.length, // Số NV đã có điểm
                        averageScore: deptAvgScore,
                        details: detailsWithScore.map((d) => ({
                            employeeId: d.employeeId,
                            employeeName: d.employee?.fullName || "N/A",
                            averageScore: d.calculatedScore,
                        })),
                    } as DepartmentPerformanceSummary;
                } catch {
                    return {
                        department: dept,
                        month: filterMonth,
                        year: filterYear,
                        totalDepartmentEmployees: dept.employees?.length || 0,
                        employeesInReport: 0,
                        employeesWithScore: 0,
                        averageScore: null,
                        details: [],
                    } as DepartmentPerformanceSummary;
                }
            });

            const results = await Promise.all(promises);
            setPerformanceData(results);
        } catch (error) {
            console.error("Failed to fetch performance data:", error);
            toast.error("Không thể tải dữ liệu đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number | null) => {
        if (score == null) return "default";
        if (score >= 1.1) return "green";
        if (score >= 1.0) return "blue";
        if (score >= 0.8) return "orange";
        return "red";
    };

    const getCompletionPercent = (employeesInReport: number, totalEmployees: number) => {
        if (totalEmployees === 0) return 0;
        return Math.min((employeesInReport / totalEmployees) * 100, 100);
    };

    const totalStats = useMemo(() => {
        const evaluated = performanceData.filter(
            (d) => d.employeesInReport > 0
        );
        const allScores = performanceData
            .map((d) => d.averageScore)
            .filter((s): s is number => s != null);
        const avgScore =
            allScores.length > 0
                ? allScores.reduce((a, b) => a + b, 0) / allScores.length
                : null;

        const totalDeptEmployees = performanceData.reduce(
            (sum, d) => sum + d.totalDepartmentEmployees,
            0
        );
        const totalInReport = performanceData.reduce(
            (sum, d) => sum + d.employeesInReport,
            0
        );

        return {
            totalDepartments: performanceData.length,
            evaluatedDepartments: evaluated.length,
            totalDepartmentEmployees: totalDeptEmployees,
            totalEmployeesInReport: totalInReport,
            overallAverageScore: avgScore,
        };
    }, [performanceData]);

    const detailColumns: ColumnsType<{
        employeeId: number;
        employeeName: string;
        averageScore: number | null;
    }> = [
        {
            title: "STT",
            key: "no",
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Nhân viên",
            key: "employeeName",
            dataIndex: "employeeName",
            render: (name, record) => (
                <span
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() =>
                        navigate(`/management/performance/employee/${record.employeeId}`)
                    }
                >
                    {name}
                </span>
            ),
        },
        {
            title: "Điểm TB",
            key: "averageScore",
            dataIndex: "averageScore",
            width: 120,
            align: "center",
            render: (score) => (
                <Tag color={getScoreColor(score)}>
                    {score != null ? score.toFixed(2) : "-"}
                </Tag>
            ),
        },
    ];

    if (isLoading && departments.length === 0) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Spin size="large" tip="Đang tải..." />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        { title: "Đánh giá" },
                        { title: "Đánh giá theo phòng ban" },
                    ],
                },
            }}
            title={<PageTitle title="Đánh giá tất cả phòng ban" />}
        >
            {/* Filter */}
            <Card className="mb-4" size="small">
                <div className="flex items-center gap-4">
                    <span className="font-medium">Chọn tháng/năm:</span>
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
                                setSelectedDepartment(null);
                            }
                        }}
                        format="MM/YYYY"
                    />
                </div>
            </Card>

            {/* Summary Stats */}
            <Row gutter={16} className="mb-4">
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Tổng phòng ban"
                            value={totalStats.totalDepartments}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Phòng ban có đánh giá"
                            value={totalStats.evaluatedDepartments}
                            suffix={`/ ${totalStats.totalDepartments}`}
                            valueStyle={{
                                color:
                                    totalStats.evaluatedDepartments > 0
                                        ? "#3f8600"
                                        : "#cf1322",
                            }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="NV trong báo cáo / Tổng NV"
                            value={totalStats.totalEmployeesInReport}
                            suffix={`/ ${totalStats.totalDepartmentEmployees}`}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Điểm TB toàn công ty"
                            value={
                                totalStats.overallAverageScore?.toFixed(2) ||
                                "-"
                            }
                            prefix={<TrophyOutlined />}
                            valueStyle={{
                                color:
                                    totalStats.overallAverageScore &&
                                    totalStats.overallAverageScore >= 1.0
                                        ? "#3f8600"
                                        : "#cf1322",
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Spin size="large" />
                </div>
            ) : performanceData.length === 0 ? (
                <Card>
                    <Empty description="Không có dữ liệu phòng ban" />
                </Card>
            ) : (
                <Row gutter={16}>
                    {/* Department Cards */}
                    <Col span={selectedDepartment ? 12 : 24}>
                        <Row gutter={[16, 16]}>
                            {performanceData.map((item) => (
                                <Col
                                    key={item.department.id}
                                    span={selectedDepartment ? 12 : 6}
                                >
                                    <Card
                                        hoverable
                                        className={`cursor-pointer transition-all h-full ${
                                            selectedDepartment?.department
                                                .id === item.department.id
                                                ? "border-2 border-blue-500 shadow-lg"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedDepartment(
                                                selectedDepartment?.department
                                                    .id === item.department.id
                                                    ? null
                                                    : item
                                            )
                                        }
                                        size="small"
                                        styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column' } }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <TeamOutlined className="text-blue-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-sm mb-0 truncate" title={item.department.name}>
                                                        {item.department.name}
                                                    </h4>
                                                    <span className="text-xs text-gray-500">
                                                        {
                                                            item.department
                                                                .departmentCode
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <Tag
                                                color={getScoreColor(
                                                    item.employeesWithScore === item.employeesInReport && item.employeesInReport > 0
                                                        ? item.averageScore
                                                        : null
                                                )}
                                                className="flex-shrink-0"
                                            >
                                                {item.employeesWithScore === item.employeesInReport && item.employeesInReport > 0
                                                    ? item.averageScore?.toFixed(2) || "-"
                                                    : "-"}
                                            </Tag>
                                        </div>

                                        <div className="flex-grow">
                                            {/* Progress bar: số NV trong báo cáo / tổng NV phòng ban */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <Progress
                                                    percent={getCompletionPercent(
                                                        item.employeesInReport,
                                                        item.totalDepartmentEmployees
                                                    )}
                                                    size="small"
                                                    showInfo={false}
                                                    strokeColor={
                                                        item.employeesInReport === item.totalDepartmentEmployees && item.totalDepartmentEmployees > 0
                                                            ? "#52c41a"
                                                            : item.employeesInReport > 0
                                                            ? "#1890ff"
                                                            : "#d9d9d9"
                                                    }
                                                    className="flex-1"
                                                />
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {item.employeesInReport}/{item.totalDepartmentEmployees}
                                                </span>
                                            </div>

                                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                <span>
                                                    <UserOutlined className="mr-1" />
                                                    {item.employeesWithScore}/{item.employeesInReport} NV đã có điểm
                                                </span>
                                                {item.employeesWithScore === item.employeesInReport && item.employeesInReport > 0 && item.averageScore != null &&
                                                    (item.averageScore >= 1.0 ? (
                                                        <RiseOutlined className="text-green-500" />
                                                    ) : (
                                                        <FallOutlined className="text-red-500" />
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 mt-2 pt-2 border-t text-xs text-gray-500 min-h-[28px]">
                                            {item.department.manager ? (
                                                <>
                                                    <Avatar
                                                        src={
                                                            item.department.manager
                                                                .avatar
                                                        }
                                                        icon={<UserOutlined />}
                                                        size="small"
                                                    />
                                                    <span className="truncate">
                                                        {
                                                            item.department.manager
                                                                .fullName
                                                        }
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400 italic">Chưa có trưởng phòng</span>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Detail Panel */}
                    {selectedDepartment && (
                        <Col span={12}>
                            <Card
                                title={
                                    <div className="flex items-center gap-2">
                                        <TeamOutlined />
                                        <span>
                                            Chi tiết phòng{" "}
                                            {selectedDepartment.department.name}
                                        </span>
                                        <Tag color="blue">
                                            {filterMonth}/{filterYear}
                                        </Tag>
                                        <Tag color={getScoreColor(
                                            selectedDepartment.employeesWithScore === selectedDepartment.employeesInReport && selectedDepartment.employeesInReport > 0
                                                ? selectedDepartment.averageScore
                                                : null
                                        )}>
                                            Điểm TB: {selectedDepartment.employeesWithScore === selectedDepartment.employeesInReport && selectedDepartment.employeesInReport > 0
                                                ? selectedDepartment.averageScore?.toFixed(2) || "-"
                                                : "-"}
                                        </Tag>
                                    </div>
                                }
                                extra={
                                    <span
                                        className="text-blue-600 cursor-pointer hover:underline"
                                        onClick={() =>
                                            navigate(
                                                `/management/performance/department/${selectedDepartment.department.id}?month=${filterMonth}&year=${filterYear}`
                                            )
                                        }
                                    >
                                        Xem chi tiết đầy đủ →
                                    </span>
                                }
                            >
                                {/* Department summary */}
                                <Row gutter={16} className="mb-4">
                                    <Col span={6}>
                                        <Statistic
                                            title="Điểm TB"
                                            value={
                                                selectedDepartment.employeesWithScore === selectedDepartment.employeesInReport && selectedDepartment.employeesInReport > 0
                                                    ? selectedDepartment.averageScore?.toFixed(2) || "-"
                                                    : "-"
                                            }
                                            valueStyle={{
                                                color: getScoreColor(
                                                    selectedDepartment.employeesWithScore === selectedDepartment.employeesInReport && selectedDepartment.employeesInReport > 0
                                                        ? selectedDepartment.averageScore
                                                        : null
                                                ),
                                            }}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="NV trong báo cáo"
                                            value={
                                                selectedDepartment.employeesInReport
                                            }
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="Đã có điểm"
                                            value={
                                                selectedDepartment.employeesWithScore
                                            }
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Statistic
                                            title="Tổng NV phòng ban"
                                            value={
                                                selectedDepartment.totalDepartmentEmployees
                                            }
                                        />
                                    </Col>
                                </Row>

                                {/* Employee list */}
                                {selectedDepartment.details.length > 0 ? (
                                    <Table
                                        dataSource={selectedDepartment.details}
                                        columns={detailColumns}
                                        rowKey="employeeId"
                                        pagination={{
                                            pageSize: 5,
                                            size: "small",
                                        }}
                                        size="small"
                                    />
                                ) : (
                                    <Empty
                                        description={`Chưa có đánh giá cho tháng ${filterMonth}/${filterYear}`}
                                    />
                                )}
                            </Card>
                        </Col>
                    )}
                </Row>
            )}
        </PageContainer>
    );
}
