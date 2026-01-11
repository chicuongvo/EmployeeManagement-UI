import { PageContainer } from "@ant-design/pro-components";
import { Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PageTitle from "@/components/common/shared/PageTitle";
import { useEpicTask } from "./EpicTaskContext";
import TaskList from "./components/TaskList";
import FormCreateTask from "./components/FormCreateTask";

const EpicTaskPage = () => {
    const { epicId, projectId } = useParams<{ epicId: string; projectId: string }>();
    const navigate = useNavigate();
    const { isLoading } = useEpicTask();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

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
                            path: `/projects/${projectId}`,
                        },
                        {
                            title: `Epic #${epicId}`,
                        },
                    ],
                },
                onBack: () => navigate(`/projects/${projectId}`),
                extra: [
                    <Button
                        key="create"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Tạo Task Mới
                    </Button>,
                ],
            }}
            title={<PageTitle title={`Tasks - Epic #${epicId}`} />}
        >
            <TaskList />

            <FormCreateTask
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />
        </PageContainer>
    );
};

export default EpicTaskPage;
