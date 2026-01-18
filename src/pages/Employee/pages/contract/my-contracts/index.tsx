import { PageContainer } from "@ant-design/pro-components";
import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useContractContext,
  ContractProvider,
} from "../ContractContext";
import DataTable from "../components/DataTable";
import ModalContract from "../components/ModalContract";
import { useUser } from "@/hooks/useUser";
import FormFilter from "../components/FormFilter";

export const TABS = {
  MY_CONTRACTS: "1",
} as const;

const MyContractsPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useContractContext();
  const { userProfile } = useUser();
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Auto filter by current user's ID when component mounts
    if (userProfile?.id) {
      setSearchParams({
        tab: "1",
        employeeId: userProfile.id.toString(),
        page: "1",
        limit: "10",
      });
    }
  }, [userProfile?.id, setSearchParams]);

  const handleChangeTab = (key: string) => {
    const params: Record<string, string> = { tab: key };
    if (userProfile?.id) {
      params.employeeId = userProfile.id.toString();
    }
    setSearchParams(params);
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Hợp đồng của tôi" }];

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
              title: "Hợp đồng của tôi",
            },
          ],
        },
      }}
      title={<PageTitle title="Hợp đồng của tôi" />}
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
                <DataTable isMyContracts={true} />
              </div>
              <ModalContract />
            </>
          ),
          label: tabItem.label,
        }))}
      />
    </PageContainer>
  );
};

const MyContracts = () => {
  return (
    <ContractProvider>
      <MyContractsPageContent />
    </ContractProvider>
  );
};

export default MyContracts;

