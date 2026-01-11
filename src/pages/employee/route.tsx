import { FaUserGroup } from "react-icons/fa6";
import { FaProjectDiagram } from "react-icons/fa";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import { DepartmentProvider } from "./pages/department/DepartmentContext";
import { ProjectProvider } from "./pages/project/ProjectContext";
import EmployeePage from "./pages/employee";
import DepartmentPage from "./pages/department";
import ProjectPage from "./pages/project";
import MainLayout from "@/layout/MainLayout";

const route: RouteItem = {
  path: "/employee",
  name: (
    <span className="font-primary">Hồ sơ nhân viên</span>
  ) as unknown as string,
  element: <MainLayout />,
  icon: <FaUserGroup className="text-base font-primary" />,
  children: [
    {
      path: "employees",
      name: "Hồ sơ nhân sự",
      element: (
        <EmployeeProvider>
          <EmployeePage />
        </EmployeeProvider>
      ),
    },
    {
      path: "departments",
      name: "Phòng ban",
      element: (
        <DepartmentProvider>
          <DepartmentPage />
        </DepartmentProvider>
      ),
    },
    {
      path: "projects",
      name: "Quản lý dự án",
      icon: <FaProjectDiagram />,
      element: (
        <ProjectProvider>
          <ProjectPage />
        </ProjectProvider>
      ),
    },
  ],
};

export default route;
