import { FaUserGroup } from "react-icons/fa6";
import { Outlet } from "react-router-dom";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import { DepartmentProvider } from "./pages/department/DepartmentContext";
import EmployeePage from "./pages/employee";
import DepartmentPage from "./pages/department";
import MainLayout from "@/layout/MainLayout";
import EmployeeDetailPage from "./pages/employee_detail";
import { EmployeeDetailProvider } from "./pages/employee_detail/EmployeeDetailContex";

import PerformancePage from "@/pages/employee/pages/performance";
import PerformanceDetailPage from "@/pages/employee/pages/performanceDetail";

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
      path: "employees/add-new",
      name: "Thêm mới",
      element: (
        <EmployeeDetailProvider>
          <EmployeeDetailPage />
        </EmployeeDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "employees/:id",
      name: "Chi tiết",
      element: (
        <EmployeeDetailProvider>
          <EmployeeDetailPage />
        </EmployeeDetailProvider>
      ),
      hideInMenu: true,
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
      path: "performance",
      name: "Performance",
      element: <Outlet />,
      children: [
        {
          index: true,
          name: "Performance",
          element: <PerformancePage />,
        },
        {
          path: ":id",
          name: "Performance Detail",
          element: <PerformanceDetailPage />,
        },
      ],
    },
  ],
};

export default route;
