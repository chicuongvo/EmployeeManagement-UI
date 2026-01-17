import { FaProjectDiagram } from "react-icons/fa";

import { type RouteItem } from "@/routes";
import { ProjectProvider } from "../employee/pages/project/ProjectContext";
import { ProjectDetailProvider } from "../employee/pages/project-detail/ProjectDetailContext";
import { EpicTaskProvider } from "../employee/pages/epic-tasks/EpicTaskContext";
import ProjectPage from "../employee/pages/project";
import ProjectDetailPage from "../employee/pages/project-detail";
import EpicTaskPage from "../employee/pages/epic-tasks";
import MainLayout from "@/layout/MainLayout";

const route: RouteItem = {
    path: "/projects",
    name: (
        <span className="font-primary">Quản lý dự án</span>
    ) as unknown as string,
    element: <MainLayout />,
    icon: <FaProjectDiagram className="text-base font-primary" />,
    children: [
        {
            path: "",
            index: true,
            element: (
                <ProjectProvider>
                    <ProjectPage />
                </ProjectProvider>
            ),
        },
        {
            path: ":projectId",
            element: (
                <ProjectDetailProvider>
                    <ProjectDetailPage />
                </ProjectDetailProvider>
            ),
            hideInMenu: true,
        },
        {
            path: ":projectId/epics/:epicId/tasks",
            element: (
                <EpicTaskProvider>
                    <EpicTaskPage />
                </EpicTaskProvider>
            ),
            hideInMenu: true,
        },
    ],
};

export default route;

