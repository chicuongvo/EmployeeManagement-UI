import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useNotificationContext } from "../../NotificationContext";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";
import FormCreateUpdateNotification from "./components/FormCreateUpdateNotification";

export const TABS = {
  NOTIFICATION: "1",
} as const;

const Index = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const {
    tab,
    setPopupCreateNotification,
    popupCreateNotification,
    popupUpdateNotification,
    setPopupUpdateNotification,
    selectedNotification,
  } = useNotificationContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Thông báo" }];

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
              title: "Quản lý thông báo",
            },
            {
              title: "Thông báo",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý thông báo" />}
      extra={[
        <PrimaryButton
          key="create-notification"
          icon={<PlusOutlined className="icon-hover-effect" />}
          color="green"
          className="font-primary"
          onClick={() => setPopupCreateNotification(true)}
        >
          Tạo thông báo
        </PrimaryButton>,
      ]}
    >
      <Tabs
        type="card"
        activeKey={`${tab ?? "1"}`}
        className="tag-ticket-list report-tab"
        onChange={handleChangeTab}
        items={tabs.map(tabItem => ({
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
      <FormCreateUpdateNotification
        open={popupCreateNotification}
        onCancel={() => setPopupCreateNotification(false)}
      />
      <FormCreateUpdateNotification
        open={popupUpdateNotification}
        onCancel={() => setPopupUpdateNotification(false)}
        notification={selectedNotification}
      />
    </PageContainer>
  );
};

export default Index;
