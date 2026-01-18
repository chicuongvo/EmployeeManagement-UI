import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import { toast, Toaster } from "sonner";
import { performanceService } from "@/apis/performance/performanceService";
import { performanceDetailService } from "@/apis/performance/performanceDetailService";
import { performanceDetailScoreService } from "@/apis/performance/performanceDetailScoreService";
import { performanceCriteriaService } from "@/apis/performance/performanceCriteriaService";
import type { Performance, PerformanceDetail } from "@/apis/performance/model/Performance";
import type { PerformanceCriteria } from "@/apis/performance/model/PerformanceCriteria";
import AddPerformanceDetailDialog, { type PerformanceDetailSubmit } from "./components/AddPerformanceDetailDialog";
import ViewPerformanceDetailDialog from "./components/ViewPerformanceDetailDialog";
import FormFilter from "./components/FormFilter";
import TableComponent from "@/components/common/table/TableComponent";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import useTableStore from "@/stores/tableStore";

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

  const { setListPerformanceDetailActiveKey, listPerformanceDetailActiveKey } = useTableStore(
    (state) => state
  );

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
        title: "No",
        key: "no",
        render: (_, __, index: number) => {
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: "Employee Code",
        key: "employeeCode",
        width: 150,
        fixed: "left",
        align: "left",
        render: (_, record) => (
          <TooltipTruncatedText value={record.employee?.employeeCode || "N/A"} />
        ),
      },
      {
        title: "Employee Name",
        key: "employeeName",
        fixed: "left",
        width: 250,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <img
              src={record.employee?.avatar || "/default-avatar.svg"}
              alt={record.employee?.fullName || "Unknown"}
              className="w-8 h-8 rounded-full object-cover"
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
      title: c.name,
      key: `criteria_${c.id}`,
      align: "center" as const,
      width: 120,
      render: (_, record) => formatScore(getScoreByCriteriaId(record, c.id)),
    }));

    const actionColumns: ColumnsType<PerformanceDetail> = [
      {
        title: "Average Score",
        key: "averageScore",
        align: "center",
        width: 120,
        render: (_, record) => formatScore(calculateAverageScore(record)),
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Button
            type="text"
            onClick={() => {
              setSelectedDetail(record);
              setIsViewDialogOpen(true);
            }}
            icon={<EyeOutlined style={{ color: "#1890ff" }} />}
          />
        ),
      },
    ];

    return [...fixedColumns, ...criteriaColumns, ...actionColumns];
  }, [criteria, currentPage, pageSize]);

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listPerformanceDetailActiveKey) {
      setListPerformanceDetailActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== "action")
      );
    }
  }, [columns, setListPerformanceDetailActiveKey, listPerformanceDetailActiveKey]);

  const paginationConfig = useMemo(
    () => ({
      total: filteredDetails.length,
      pageSize: pageSize,
      current: currentPage,
      showTotal: (total: number) => (
        <span>
          <span className="font-bold">Total:</span> {total}
        </span>
      ),
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    }),
    [filteredDetails.length, pageSize, currentPage]
  );

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
    { key: "1", label: `Performance ${performance.month}/${performance.year}` },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Master list",
            },
            {
              title: "Performance",
              onClick: () => navigate("/employee/performance"),
              className: "cursor-pointer hover:text-blue-600",
            },
            {
              title: `${performance.month}/${performance.year}`,
            },
          ],
        },
      }}
      title={
        <PageTitle title={`Performance ${performance.month}/${performance.year}`} />
      }
    >
      <Toaster position="top-right" />

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
                onAddReport={() => setIsDialogOpen(true)}
                loading={isLoading}
              />

              {/* Table */}
              <TableComponent
                isSuccess={!isLoading}
                rowKey={(record) => record.id || ""}
                dataSource={filteredDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                columns={columns}
                scroll={{ x: true }}
                activeKeys={listPerformanceDetailActiveKey}
                setActiveKeys={setListPerformanceDetailActiveKey}
                pagination={paginationConfig}
                onChange={handleTableChange}
                editColumnMode={true}
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