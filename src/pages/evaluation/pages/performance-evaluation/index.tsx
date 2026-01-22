import { useRef } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/shared/PageTitle";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import AddPerformanceDialog from "./components/performanceDialog";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import { usePerformanceContext } from "./PerformanceContext";
import { performanceService } from "@/apis/performance/performanceService";
import { toast } from "sonner";

export const TABS = {
  PERFORMANCE: "1",
} as const;

const PerformancePage = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const {
    tab,
    popupAddPerformance,
    setPopupAddPerformance,
    refetch,
  } = usePerformanceContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Danh sách đánh giá" }];

  const scrollToDataTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAddPerformance = async (month: number, year: number) => {
    try {
      await performanceService.create(month, year);
      toast.success("Đã thêm phiếu đánh giá thành công!");
      refetch();
    } catch (error) {
      console.error("Failed to create performance review:", error);
      toast.error("Không thể thêm phiếu đánh giá. Vui lòng thử lại!");
    }
  };

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
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý đánh giá hiệu suất" />}
      extra={[
        <PrimaryButton
          key="add-performance"
          icon={<PlusOutlined className="icon-hover-effect" />}
          color="green"
          className="font-primary"
          onClick={() => setPopupAddPerformance(true)}
        >
          Thêm mới
        </PrimaryButton>,
      ]}
    >
      <Tabs
        type="card"
        activeKey={`${tab ?? "1"}`}
        className="tag-ticket-list report-tab"
        onChange={handleChangeTab}
        items={tabs.map((tabItem) => ({
          key: tabItem.key,
          children: (
            <>
              <FormFilter onSearch={scrollToDataTable} />
              <div ref={dataTableRef}>
                <DataTable />
              </div>
            </>
          ),
          label: tabItem.label,
        }))}
      />

      {/* Add Dialog */}
      <AddPerformanceDialog
        open={popupAddPerformance}
        onOpenChange={setPopupAddPerformance}
        onSubmit={handleAddPerformance}
      />
    </PageContainer>
  );
};

export default PerformancePage;
