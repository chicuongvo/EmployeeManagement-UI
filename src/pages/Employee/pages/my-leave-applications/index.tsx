import { PageContainer } from "@ant-design/pro-components";
import { useRef, useEffect } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useMyLeaveApplicationContext, MyLeaveApplicationProvider } from "./MyLeaveApplicationContext";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import FormCreateUpdateLeaveApplication from "./components/FormCreateUpdateLeaveApplication";
import { useUser } from "@/hooks/useUser";

export const TABS = {
  MY_LEAVE_APPLICATION: "1",
} as const;

const MyLeaveApplicationPageContent = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const {
    tab,
    setPopupCreateLeaveApplication,
    popupCreateLeaveApplication,
    popupUpdateLeaveApplication,
    setPopupUpdateLeaveApplication,
    selectedLeaveApplication,
  } = useMyLeaveApplicationContext();
  const { userProfile } = useUser();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Khi vào trang "Đơn nghỉ phép của tôi", luôn filter theo user hiện tại
    if (userProfile?.id && !tab) {
      setSearchParams({
        tab: "1",
        page: "1",
        limit: "10",
      });
    }
  }, [userProfile?.id, setSearchParams, tab]);

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    { key: "1", label: "Đơn nghỉ phép của tôi" },
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
              title: "Đơn nghỉ phép của tôi",
            },
          ],
        },
      }}
      title={<PageTitle title="Đơn nghỉ phép của tôi" />}
      extra={[
        <PrimaryButton
          key="create-leave-application"
          icon={<PlusOutlined className="icon-hover-effect" />}
          color="green"
          className="font-primary"
          onClick={() => setPopupCreateLeaveApplication(true)}
        >
          Tạo đơn nghỉ phép
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
      <FormCreateUpdateLeaveApplication
        open={popupCreateLeaveApplication}
        onCancel={() => setPopupCreateLeaveApplication(false)}
      />
      <FormCreateUpdateLeaveApplication
        open={popupUpdateLeaveApplication}
        onCancel={() => setPopupUpdateLeaveApplication(false)}
        leaveApplication={selectedLeaveApplication}
      />
    </PageContainer>
  );
};

const MyLeaveApplicationPage = () => {
  return (
    <MyLeaveApplicationProvider>
      <MyLeaveApplicationPageContent />
    </MyLeaveApplicationProvider>
  );
};

export default MyLeaveApplicationPage;
