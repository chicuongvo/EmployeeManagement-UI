import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import ModalContract from "./components/ModalContract";
import ModalCreateContract from "./components/ModalCreateContract";
import ModalEditContract from "./components/ModalEditContract";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useContractContext,
  ContractProvider,
} from "./ContractContext";

export const TABS = {
  CONTRACT: "1",
} as const;

const ContractPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab, setPopupCreateContract } = useContractContext();
  const [_, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Danh sách hợp đồng" }];

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
              title: "Hợp đồng",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý hợp đồng" />}
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
              <Card className="mb-3" size="small">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setPopupCreateContract(true)}
                >
                  Tạo hợp đồng mới
                </Button>
              </Card>
              <FormFilter onSearch={scrollToDataTable} />
              <div ref={dataTableRef}>
                <DataTable />
              </div>
              <ModalContract />
              <ModalCreateContract />
              <ModalEditContract />
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

