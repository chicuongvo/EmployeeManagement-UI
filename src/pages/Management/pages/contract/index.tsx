import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useContractContext,
  ContractProvider,
} from "../../../Employee/pages/contract/ContractContext";
import FormFilter from "../../../Employee/pages/contract/components/FormFilter";
import DataTable from "./components/DataTable";
import PrimaryButton from "@/components/common/button/PrimaryButton";

export const TABS = {
  CONTRACT: "1",
} as const;

const ContractPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useContractContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    { key: TABS.CONTRACT, label: "Danh sách hợp đồng" },
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
              title: "Quản lý nhân sự",
            },
            {
              title: "Hợp đồng",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý hợp đồng" />}
      extra={[
        <Link to="/management/contracts/add-new" key="create-contract">
          <PrimaryButton
            icon={<PlusOutlined className="icon-hover-effect" />}
            key="new-contract"
            color="green"
            className="font-primary"
          >
            Thêm mới
          </PrimaryButton>
        </Link>,
      ]}
    >
      <Tabs
        type="card"
        activeKey={`${tab ?? TABS.CONTRACT}`}
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
    <ContractProvider>
      <ContractPageContent />
    </ContractProvider>
  );
};

export default Index;
