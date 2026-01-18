import { PageContainer } from "@ant-design/pro-components";
import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useUpdateRequestContext,
  UpdateRequestProvider,
} from "../UpdateRequestContext";
import DataTable from "../components/DataTable";
import ModalUpdateRequest from "../components/ModalUpdateRequest";
import { useUser } from "@/hooks/useUser";
import FormFilter from "../components/FormFilter";

export const TABS = {
  MY_REQUESTS: "1",
} as const;

const MyRequestsPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab, setPopupUpdateRequest, setSelectedUpdateRequest } =
    useUpdateRequestContext();
  const { userProfile } = useUser();
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Auto filter by current user's ID when component mounts
    if (userProfile?.id) {
      setSearchParams({
        tab: "1",
        requestedById: userProfile.id.toString(),
        page: "1",
        limit: "10",
      });
    }
  }, [userProfile?.id, setSearchParams]);

  const handleChangeTab = (key: string) => {
    const params: Record<string, string> = { tab: key };
    if (userProfile?.id) {
      params.requestedById = userProfile.id.toString();
    }
    setSearchParams(params);
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Đơn yêu cầu của tôi" }];

  const scrollToDataTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedUpdateRequest(null);
    setPopupUpdateRequest(true);
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
              title: "Đơn yêu cầu của tôi",
            },
          ],
        },
      }}
      title={<PageTitle title="Đơn yêu cầu của tôi" />}
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
              <div className="mb-4 flex justify-between items-center">
                <div></div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateNew}
                  style={{
                    background: "#306e51",
                    borderColor: "#306e51",
                  }}
                >
                  Tạo đơn yêu cầu mới
                </Button>
              </div>
              <FormFilter onSearch={scrollToDataTable} />
              <div ref={dataTableRef}>
                <DataTable isMyRequests={true} />
              </div>
              <ModalUpdateRequest isMyRequests={true} />
            </>
          ),
          label: tabItem.label,
        }))}
      />
    </PageContainer>
  );
};

const MyRequests = () => {
  return (
    <UpdateRequestProvider>
      <MyRequestsPageContent />
    </UpdateRequestProvider>
  );
};

export default MyRequests;
