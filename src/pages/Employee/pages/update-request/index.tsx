import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import ModalUpdateRequest from "./components/ModalUpdateRequest";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useUpdateRequestContext,
  UpdateRequestProvider,
} from "./UpdateRequestContext";

export const TABS = {
  UPDATE_REQUEST: "1",
} as const;

const UpdateRequestPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { refetch, tab, setPopupUpdateRequest, setSelectedUpdateRequest } =
    useUpdateRequestContext();
  const [_, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Update Request List" }];

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
              title: "Master list",
            },
            {
              title: "Update Request",
            },
          ],
        },
      }}
      title={<PageTitle title="Update Request Management" />}
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
              <ModalUpdateRequest />
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
