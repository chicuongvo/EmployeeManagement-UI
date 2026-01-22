import { PageContainer } from "@ant-design/pro-components";
import { useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import {
  useUpdateRequestContext,
  UpdateRequestProvider,
} from "../UpdateRequestContext";
import DataTable from "../components/DataTable";
import { useUser } from "@/hooks/useUser";
import FormFilter from "../components/FormFilter";
import PrimaryButton from "@/components/common/button/PrimaryButton";

export const TABS = {
  MY_REQUESTS: "1",
} as const;

const MyRequestsPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useUpdateRequestContext();
  const { userProfile } = useUser();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Khi vào trang \"Đơn yêu cầu của tôi\", luôn filter theo user hiện tại
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

  const tabs: TabsProps["items"] = [
    { key: TABS.MY_REQUESTS, label: "Đơn yêu cầu của tôi" },
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
              title: "Đơn yêu cầu của tôi",
            },
          ],
        },
      }}
      title={<PageTitle title="Đơn yêu cầu của tôi" />}
    >
      <Tabs
        type="card"
        activeKey={`${tab ?? TABS.MY_REQUESTS}`}
        className="tag-ticket-list report-tab"
        onChange={handleChangeTab}
        items={tabs.map((tabItem) => ({
          key: tabItem.key,
          children: (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div />
                <Link to="/employee/my-update-requests/add-new">
                  <PrimaryButton
                    icon={<PlusOutlined className="icon-hover-effect" />}
                    color="green"
                    className="font-primary"
                  >
                    Tạo đơn yêu cầu mới
                  </PrimaryButton>
                </Link>
              </div>
              <FormFilter onSearch={scrollToDataTable} isMyRequests />
              <div ref={dataTableRef}>
                <DataTable isMyRequests />
              </div>
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
