import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import {
  useUpdateRequestContext,
  UpdateRequestProvider,
} from "./UpdateRequestContext";

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

  const tabs: TabsProps["items"] = [{ key: "1", label: "Danh sách yêu cầu cập nhật" }];

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

const Index = () => {
  return (
    <UpdateRequestProvider>
      <UpdateRequestPageContent />
    </UpdateRequestProvider>
  );
};

export default Index;
