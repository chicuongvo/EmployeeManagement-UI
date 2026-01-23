import { type RouteItem } from "@/routes";
import { ROLE_LEVELS } from "@/constants/roleLevel";
import { PerformanceProvider } from "../Employee/pages/performance/PerformanceContext";
import PerformancePage from "../Employee/pages/performance";
import PerformanceDetailPage from "../Employee/pages/performanceDetail";
import PerformanceByEmployeePage from "../Employee/pages/performanceByEmployee";
import PerformanceByDepartmentPage from "../Employee/pages/performanceByDepartment";
import AllDepartmentsPerformancePage from "../Employee/pages/performanceByDepartment/AllDepartmentsPerformance";
import PerformanceCriteriaPage from "../Employee/pages/performanceCriteria";
import MainLayout from "@/layout/MainLayout";

const route: RouteItem = {
  path: "/performance",
  name: (
    <span className="font-primary">Đánh giá</span>
  ) as unknown as string,
  element: <MainLayout />,
  minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL, // Manager level (2) and above
  children: [
    {
      path: "list",
      name: "Đánh giá",
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL, // Manager level (2) and above
      element: (
        <PerformanceProvider>
          <PerformancePage />
        </PerformanceProvider>
      ),
    },
    {
      path: "criteria",
      name: "Tiêu chí đánh giá",
      minRoleLevel: ROLE_LEVELS.HR_LEVEL, // HR level (3) and above
      element: <PerformanceCriteriaPage />,
    },
    {
      path: "department",
      name: "Đánh giá phòng ban",
      minRoleLevel: ROLE_LEVELS.HR_LEVEL, // HR level (3) and above - only HR can view all departments
      element: <AllDepartmentsPerformancePage />,
    },
    {
      path: "department/:departmentId",
      name: "Chi tiết đánh giá phòng ban",
      minRoleLevel: ROLE_LEVELS.HR_LEVEL, // HR level (3) and above
      element: <PerformanceByDepartmentPage />,
      hideInMenu: true,
    },
    {
      path: ":id",
      name: "Đánh giá chi tiết",
      element: <PerformanceDetailPage />,
      hideInMenu: true,
    },
    {
      path: "employee/:employeeId",
      name: "Đánh giá nhân viên",
      element: <PerformanceByEmployeePage />,
      hideInMenu: true,
    },
  ],
};

export default route;
