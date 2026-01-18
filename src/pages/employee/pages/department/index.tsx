import { PageContainer } from "@ant-design/pro-components";
import { useRef } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useDepartmentContext } from "./DepartmentContext";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ModalCreateUpdateDepartmentPosition from "./components/ModalCreateUpdateDepartmentPosition";
import ModalChangeRoleLevel from "./components/ModalChangeRoleLevel";

export const TABS = {
  DEPARTMENT: "1",
  POSITION: "2",
  ROLE: "3",
} as const;

const Index = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab, openCreateModal, openChangeRoleLevelModal } = useDepartmentContext();
  const [, setSearchParams] = useSearchParams();

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    { key: "1", label: "Phòng ban" },
    { key: "2", label: "Chức vụ" },
    { key: "3", label: "Cấp bậc" },
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
              title: "Phòng ban",
            },
            {
              title: tab === TABS.DEPARTMENT ? "Phòng ban" : "Chức vụ",
            },
          ],
        },
      }}
      title={
        <PageTitle title={tab === TABS.DEPARTMENT ? "Phòng ban" : "Chức vụ"} />
      }
      extra={
        <div className="flex gap-2">
          <PrimaryButton
            icon={<PlusOutlined className="icon-hover-effect" />}
            key="new-department"
            color="green"
            className="font-primary"
            onClick={openCreateModal}
          >
            Thêm mới
          </PrimaryButton>

          {tab === TABS.ROLE && (
            <PrimaryButton
              onClick={openChangeRoleLevelModal}
              className="bg-transparent border text-green border-green hover:bg-transparent"
              // disabled={loading}
              // loading={loading}
              icon={<EditOutlined className="icon-hover-effect" />}
              key="reset"
              type="button"
            >
              Sửa thứ tự
            </PrimaryButton>
          )}
        </div>
      }
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
      <ModalCreateUpdateDepartmentPosition />
      <ModalChangeRoleLevel />
    </PageContainer>
  );
};

export default Index;
