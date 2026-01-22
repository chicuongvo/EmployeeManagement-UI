import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/shared/PageTitle";
import EpicKanbanBoard from "./components/epic/EpicKanbanBoard";
import ProjectMemberPage from "./components/members/ProjectMemberPage";
import ProjectInfoPage from "./components/info/ProjectInfoPage";

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "epics";

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = [
    {
      key: "epics",
      label: "Epics",
      children: <EpicKanbanBoard />,
    },
    {
      key: "members",
      label: "Thành viên",
      children: <ProjectMemberPage />,
    },
    {
      key: "info",
      label: "Thông tin chung",
      children: <ProjectInfoPage />,
    },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Quản lý dự án",
              path: "/management/projects",
            },
            {
              title: `Dự án #${projectId}`,
            },
          ],
        },
        onBack: () => navigate("/management/projects"),
      }}
      title={<PageTitle title={`Dự án #${projectId}`} />}
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabs}
        type="card"
      />
    </PageContainer>
  );
};

export default ProjectDetailPage;
