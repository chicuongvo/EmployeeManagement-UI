import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "@/components/common/shared/PageTitle";
import EpicKanbanBoard from "./components/epic/EpicKanbanBoard";

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
            key: "info",
            label: "Thông tin chung",
            children: <div>Thông tin dự án (Coming soon)</div>,
        },
        {
            key: "members",
            label: "Thành viên",
            children: <div>Danh sách thành viên (Coming soon)</div>,
        },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: "Quản lý dự án",
                            path: "/projects",
                        },
                        {
                            title: `Dự án #${projectId}`,
                        },
                    ],
                },
                onBack: () => navigate("/projects"),
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
