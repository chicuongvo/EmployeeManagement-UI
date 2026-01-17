import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useDepartmentContext } from "./DepartmentContext";

export const TABS = {
  DEPARTMENT: "1",
  POSITION: "2",
} as const;

const Index = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useDepartmentContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    { key: "1", label: "Phòng ban" },
    { key: "2", label: "Chức vụ" },
  ];

  const scrollToDataTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Phòng ban",
            },
            {
              title: tab === TABS.DEPARTMENT ? "Phòng ban" : "Chức vụ",
            },
          ],
        },
      }}
      title={
        <PageTitle title={tab === TABS.DEPARTMENT ? "Phòng ban" : "Chức vụ"} />
      }
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
    </PageContainer>
  );
};

export default Index;
