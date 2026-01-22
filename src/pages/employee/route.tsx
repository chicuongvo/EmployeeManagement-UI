import { FaUserGroup } from "react-icons/fa6";
import { VideoCameraOutlined } from "@ant-design/icons";

import { type RouteItem } from "@/routes";
import { ROLE_LEVELS } from "@/constants/roleLevel";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import { DepartmentProvider } from "./pages/department/DepartmentContext";
import { LeaveApplicationProvider } from "./pages/leave-application/LeaveApplicationContext";
import EmployeePage from "./pages/employee";
import MyRequestsPage from "./pages/update-request/my-requests";
import MyContractsPage from "./pages/contract/my-contracts";
import ContractDetailPage from "./pages/contract_detail";
import { ContractDetailProvider } from "./pages/contract_detail/ContractDetailContext";
import UpdateRequestDetailPage from "./pages/update_request_detail";
import { UpdateRequestDetailProvider } from "./pages/update_request_detail/UpdateRequestDetailContext";
import MeetingPage from "./pages/meeting";
import DepartmentPage from "./pages/department";
import LeaveApplicationPage from "./pages/leave-application";
import VideoCall from "./pages/video-call";
import MainLayout from "@/layout/MainLayout";
import EmployeeDetailPage from "./pages/employee_detail";
import { EmployeeDetailProvider } from "./pages/employee_detail/EmployeeDetailContex";
import DepartmentDetailPage from "./pages/department_detail";
import { DepartmentDetailProvider } from "./pages/department_detail/DepartmentDetailContext";

import PerformancePage from "@/pages/Employee/pages/performance";
import { PerformanceProvider } from "./pages/performance/PerformanceContext";
import PerformanceDetailPage from "@/pages/Employee/pages/performanceDetail";
import PerformanceByEmployeePage from "@/pages/Employee/pages/performanceByEmployee";
import PerformanceByDepartmentPage from "@/pages/Employee/pages/performanceByDepartment";
import MyPerformancePage from "@/pages/Employee/pages/myPerformance";
import PerformanceCriteriaPage from "@/pages/Employee/pages/performanceCriteria";

const route: RouteItem = {
  path: "/employee",
  name: (
    <span className="font-primary">Thông tin cá nhân</span>
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
      path: "update-requests/add-new",
      name: "Thêm mới",
      element: (
        <UpdateRequestDetailProvider>
          <UpdateRequestDetailPage />
        </UpdateRequestDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "my-update-requests/add-new",
      name: "Thêm mới",
      element: (
        <UpdateRequestDetailProvider>
          <UpdateRequestDetailPage />
        </UpdateRequestDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "my-update-requests/:id",
      name: "Chi tiết",
      element: (
        <UpdateRequestDetailProvider>
          <UpdateRequestDetailPage />
        </UpdateRequestDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "update-requests/:id",
      name: "Chi tiết",
      element: (
        <UpdateRequestDetailProvider>
          <UpdateRequestDetailPage />
        </UpdateRequestDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "my-update-requests",
      name: "Đơn yêu cầu của tôi",
      element: <MyRequestsPage />,
    },
    {
      path: "my-contracts",
      name: "Hợp đồng của tôi",
      element: <MyContractsPage />,
    },
    {
      path: "my-contracts/:id",
      name: "Chi tiết hợp đồng của tôi",
      element: (
        <ContractDetailProvider>
          <ContractDetailPage />
        </ContractDetailProvider>
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
      path: "leave-applications",
      name: "Đơn nghỉ phép",
      element: (
        <LeaveApplicationProvider>
          <LeaveApplicationPage />
        </LeaveApplicationProvider>
      ),
    },
    {
      path: "departments/:id",
      name: "Chi tiết phòng ban",
      element: (
        <DepartmentDetailProvider>
          <DepartmentDetailPage />
        </DepartmentDetailProvider>
      ),
      hideInMenu: true,
    },
    {
      path: "performance",
      name: "Đánh giá",
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL, // Manager level (2) and above
      element: (
        <PerformanceProvider>
          <PerformancePage />
        </PerformanceProvider>
      ),
    },
    {
      path: "performance-criteria",
      name: "Tiêu chí đánh giá",
      minRoleLevel: ROLE_LEVELS.HR_LEVEL, // HR level (3) and above
      element: <PerformanceCriteriaPage />,
    },
    {
      path: "my-performance",
      name: "Đánh giá của tôi",
      // minRoleLevel: 1, // Employee level (1) and above
      element: <MyPerformancePage />,
    },
    {
      path: "department-performance",
      name: "Đánh giá phòng ban",
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL, // Manager level (2) and above
      element: <PerformanceByDepartmentPage />,
    },
    {
      path: "performance/:id",
      name: "Đánh giá chi tiết",
      element: <PerformanceDetailPage />,
      hideInMenu: true,
    },
    {
      path: "performance/employee/:employeeId",
      name: "Đánh giá nhân viên",
      element: <PerformanceByEmployeePage />,
      hideInMenu: true,
    },

    {
      path: "meetings",
      name: "Cuộc họp sắp tới",
      element: <MeetingPage />,
      icon: <VideoCameraOutlined />,
    },
    {
      path: "video-call",
      name: "Video Call",
      element: <VideoCall />,
      hideInMenu: true,
    },
  ],
};

export default route;
