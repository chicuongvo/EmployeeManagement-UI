import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "../../../Employee/pages/update-request/components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useUpdateRequestContext,
  UpdateRequestProvider,
} from "../../../Employee/pages/update-request/UpdateRequestContext";

export const TABS = {
  UPDATE_REQUEST: "1",
} as const;

const UpdateRequestPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useUpdateRequestContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    { key: TABS.UPDATE_REQUEST, label: "Danh sách yêu cầu cập nhật" },
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
              title: "Hồ sơ nhân sự",
            },
            {
              title: "Yêu cầu cập nhật",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý yêu cầu cập nhật" />}
    >
      <Tabs
        type="card"
        activeKey={`${tab ?? TABS.UPDATE_REQUEST}`}
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

const Index = () => {
  return (
    <UpdateRequestProvider>
      <UpdateRequestPageContent />
    </UpdateRequestProvider>
  );
};

export default Index;
