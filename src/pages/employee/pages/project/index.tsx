import { PageContainer } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import FormFilter from "./components/FormFilter";
import DataTable from "./components/DataTable";
import { useSearchParams } from "react-router-dom";
import { Tabs, type TabsProps, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import { useProjectContext } from "./ProjectContext";
import FormCreateProject from "./components/FormCreateProject";
import PrimaryButton from "@/components/common/button/PrimaryButton";

export const TABS = {
  PROJECT: "1",
} as const;

const Index = () => {
  const dataTableRef = useRef<HTMLDivElement>(null);
  const { tab, selectedProject, setSelectedProject } = useProjectContext();
  const [, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [{ key: "1", label: "Dự án" }];

  const scrollToDataTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleOpenModal = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleEditProject = () => {
    if (selectedProject) {
      setIsModalOpen(true);
    }
  };

  // Auto-open modal when selectedProject changes
  if (selectedProject && !isModalOpen) {
    handleEditProject();
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Quản lý dự án",
            },
            {
              title: "Danh sách dự án",
            },
          ],
        },
      }}
      title={<PageTitle title="Quản lý dự án" />}
      extra={[
        <PrimaryButton
          key="create"
          //   type="primary"
          color="green"
          icon={<PlusOutlined className="icon-hover-green" />}
          onClick={handleOpenModal}
        >
          Tạo dự án mới
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

      <FormCreateProject
        open={isModalOpen}
        onCancel={handleCloseModal}
        project={selectedProject}
      />
    </PageContainer>
  );
};

export default Index;
