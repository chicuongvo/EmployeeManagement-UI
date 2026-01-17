import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useEmployeeContext } from "./EmployeeContext";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { PlusOutlined } from "@ant-design/icons";

export const TABS = {
  EMPLOYEE: "1",
} as const;

const Index = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab } = useEmployeeContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Nhân viên" }];

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
              title: "Hồ sơ nhân viên",
            },
          ],
        },
      }}
      title={<PageTitle title="Hồ sơ nhân viên" />}
      extra={[
        <Link to={`/employee/employees/add-new`} key="create-employee">
          <PrimaryButton
            icon={<PlusOutlined className="icon-hover-effect" />}
            key="new-employee"
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

export default Index;
