import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, Table, Tag, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { performanceService } from "@/apis/performance/performanceService";
import { performanceDetailService } from "@/apis/performance/performanceDetailService";
import { performanceDetailScoreService } from "@/apis/performance/performanceDetailScoreService";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { Performance, PerformanceDetail } from "@/apis/performance/model/Performance";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import AddPerformanceDetailDialog, { type PerformanceDetailSubmit } from "./components/AddPerformanceDetailDialog";
import ViewPerformanceDetailDialog from "./components/ViewPerformanceDetailDialog";
import FormFilter from "./components/FormFilter";

export default function PerformanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [details, setDetails] = useState<PerformanceDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PerformanceDetail | null>(null);
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([]);
  const [filterValues, setFilterValues] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const performanceId = parseInt(id!);

      // Fetch both performance data and criteria in parallel
      const [performanceData, criteriaData] = await Promise.all([
        performanceService.getById(performanceId),
        performanceCriteriaService.getAll(),
      ]);

      setPerformance(performanceData);
      setDetails(performanceData.details || []);
      setCriteria(criteriaData);
    } catch (error) {
      console.error("Failed to fetch performance details:", error);
      toast.error("Không thể tải dữ liệu chi tiết");
    } finally {
      setIsLoading(false);
    }
  };

  const formatScore = (score: number | null) => {
    return score !== null ? score.toFixed(1) : "-";
  };

  const getScoreByCriteriaId = (detail: PerformanceDetail, criteriaId: number): number | null => {
    if (!detail.scores) return null;
    const scoreObj = detail.scores.find((s) => s.performanceCriteriaId === criteriaId);
    return scoreObj ? scoreObj.score : null;
  };

  const calculateAverageScore = (detail: PerformanceDetail): number | null => {
    if (!detail.scores || detail.scores.length === 0) return null;
    const total = detail.scores.reduce((sum, score) => sum + score.score, 0);
    return total / detail.scores.length;
  };

  // Filter details based on filter values
  const filteredDetails = useMemo(() => {
    let filtered = details;

    // Apply filter values
    if (filterValues.fullName) {
      const query = filterValues.fullName.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.fullName.toLowerCase().includes(query)
      );
    }
    if (filterValues.email) {
      const query = filterValues.email.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.email.toLowerCase().includes(query)
      );
    }
    if (filterValues.phone) {
      const query = filterValues.phone.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.phone?.toLowerCase().includes(query)
      );
    }
    if (filterValues.employeeCode) {
      const query = filterValues.employeeCode.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.employeeCode?.toLowerCase().includes(query)
      );
    }
    if (filterValues.department) {
      const query = filterValues.department.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.departmentId?.toString().includes(query)
      );
    }
    if (filterValues.position) {
      const query = filterValues.position.toLowerCase();
      filtered = filtered.filter((detail) =>
        detail.employee?.positionId?.toString().includes(query)
      );
    }

    return filtered;
  }, [details, filterValues]);

  // Build table columns dynamically based on criteria
  const baseColumns: ColumnsType<PerformanceDetail> = useMemo(() => {
    const fixedColumns: ColumnsType<PerformanceDetail> = [
      {
        title: "STT",
        key: "no",
        render: (_, __, index: number) => {
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: "Mã NV",
        key: "employeeCode",
        width: 120,
        fixed: "left",
        align: "center",
        render: (_, record) => (
          <Tag color="blue">{record.employee?.employeeCode || "N/A"}</Tag>
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
              src={record.employee?.avatar || "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"}
              size={40}
            />
            <div className="flex flex-col">
              <span className="font-medium">{record.employee?.fullName || "N/A"}</span>
              <span className="text-xs text-gray-500">{record.employee?.email || ""}</span>
            </div>
          </div>
        ),
      },
    ];

    const criteriaColumns: ColumnsType<PerformanceDetail> = criteria.map((c) => ({
      title: (
        <Tooltip title={c.description}>
          {c.name}
        </Tooltip>
      ),
      key: `criteria_${c.id}`,
      align: "center" as const,
      width: 120,
      render: (_, record) => {
        const score = getScoreByCriteriaId(record, c.id);
        if (score === null) return <span className="text-gray-400">-</span>;
        const color = score >= 4 ? "green" : score >= 3 ? "blue" : score >= 2 ? "orange" : "red";
        return <Tag color={color}>{formatScore(score)}</Tag>;
      },
    }));

    const actionColumns: ColumnsType<PerformanceDetail> = [
      {
        title: "Điểm TB",
        key: "averageScore",
        align: "center",
        width: 100,
        render: (_, record) => {
          const avg = calculateAverageScore(record);
          if (avg === null) return <span className="text-gray-400">-</span>;
          const color = avg >= 4 ? "green" : avg >= 3 ? "blue" : avg >= 2 ? "orange" : "red";
          return <Tag color={color} className="font-bold">{formatScore(avg)}</Tag>;
        },
      },
      {
        title: "Hành động",
        key: "action",
        width: 100,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Tooltip title="Xem chi tiết">
            <button
              onClick={() => {
                setSelectedDetail(record);
                setIsViewDialogOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <EyeOutlined />
              Xem
            </button>
          </Tooltip>
        ),
      },
    ];

    return [...fixedColumns, ...criteriaColumns, ...actionColumns];
  }, [criteria, currentPage, pageSize]);

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleFilterSearch = (values: any) => {
    setFilterValues(values);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilterValues({});
    setCurrentPage(1);
  };

  const handleAddPerformanceDetail = async (data: PerformanceDetailSubmit) => {
    try {
      const createdDetail = await performanceDetailService.create({
        employeeId: data.employeeId,
        supervisorId: data.supervisorId,
        performanceReportId: data.performanceReportId,
        // send scores only if provided
        ...(data.scores ? { scores: data.scores } : {}),
      });

      if (data.scores && data.scores.length > 0) {
        await Promise.all(
          data.scores.map((item) =>
            performanceDetailScoreService.create({
              performanceReportDetailId: createdDetail.id,
              performanceCriteriaId: item.criteriaId,
              score: item.score,
            }),
          ),
        );
      }

      toast.success("Đã thêm đánh giá thành công!");
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to add performance detail:", error);
      toast.error("Không thể thêm đánh giá");
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#718ebf] text-[16px]">Đang tải...</div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="relative min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#718ebf] text-[16px]">Không tìm thấy phiếu đánh giá</div>
      </div>
    );
  }

  const tabs: TabsProps["items"] = [
    { key: "1", label: `Đánh giá tháng ${performance.month}/${performance.year}` },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Đánh giá",
            },
            {
              title: "Đánh giá hiệu suất",
              onClick: () => navigate("/evaluation/performance"),
              className: "cursor-pointer hover:text-blue-600",
            },
            {
              title: `Tháng ${performance.month}/${performance.year}`,
            },
          ],
        },
      }}
      title={
        <PageTitle title={`Đánh giá tháng ${performance.month}/${performance.year}`} />
      }
      extra={[
        <PrimaryButton
          key="add-detail"
          icon={<PlusOutlined className="icon-hover-effect" />}
          color="green"
          className="font-primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Thêm đánh giá
        </PrimaryButton>,
      ]}
    >
      <Tabs
        type="card"
        activeKey="1"
        className="tag-ticket-list report-tab"
        items={tabs.map((tabItem) => ({
          key: tabItem.key,
          children: (
            <>
              <FormFilter
                onSearch={handleFilterSearch}
                onReset={handleFilterReset}
                loading={isLoading}
              />

              {/* Table */}
              <Table<PerformanceDetail>
                rowKey={(record) => record.id?.toString() || ""}
                dataSource={filteredDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                columns={columns}
                loading={isLoading}
                bordered
                scroll={{ x: 1200 }}
                pagination={{
                  total: filteredDetails.length,
                  pageSize: pageSize,
                  current: currentPage,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
                onChange={handleTableChange}
              />

              {/* Add Performance Detail Dialog */}
              <AddPerformanceDetailDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                performanceId={parseInt(id!)}
                onSubmit={handleAddPerformanceDetail}
                evaluatedEmployeeIds={details.map((d) => d.employeeId)}
              />

              {/* View Performance Detail Dialog */}
              <ViewPerformanceDetailDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                detail={selectedDetail}
                onUpdate={fetchData}
              />
            </>
          ),
          label: tabItem.label,
        }))}
      />
    </PageContainer>
  );
}