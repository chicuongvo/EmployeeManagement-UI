import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import UpdateRequestPage from "./pages/update-request";
import ManagementPastMeetingsPage from "./pages/meetings/past";
import ManagementVideoCall from "./pages/video-call";
import ManagementCreateMeetingPage from "./pages/meetings/create";
import ManagementMeetingDetailPage from "./pages/meetings/detail";
import ManagementContractPage from "./pages/contract";
import { ContractProvider } from "../Employee/pages/contract/ContractContext";
import ContractDetailPage from "../Employee/pages/contract_detail";
import { ContractDetailProvider } from "../Employee/pages/contract_detail/ContractDetailContext";
import UpdateRequestDetailPage from "../Employee/pages/update_request_detail";
import { UpdateRequestDetailProvider } from "../Employee/pages/update_request_detail/UpdateRequestDetailContext";
import { ROLE_LEVELS } from "@/constants/roleLevel";
import {
  VideoCameraOutlined,
  PlusOutlined,
  HistoryOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { LeaveApplicationProvider } from "../employee/pages/leave-application/LeaveApplicationContext";
import MyLeaveApplicationPage from "../Employee/pages/my-leave-applications";
import { FaProjectDiagram } from "react-icons/fa";
import { ProjectProvider } from "../employee/pages/project/ProjectContext";
import { ProjectDetailProvider } from "../employee/pages/project-detail/ProjectDetailContext";
import { EpicTaskProvider } from "../employee/pages/epic-tasks/EpicTaskContext";
import ProjectPage from "../employee/pages/project";
import ProjectDetailPage from "../employee/pages/project-detail";
import EmployeePage from "./pages/employee";
import EpicTaskPage from "../employee/pages/epic-tasks";
import AttendanceManagementPage from "../attendance/AttendanceManagementPage";
import { lazy } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import { EmployeeDetailProvider } from "./pages/employee_detail/EmployeeDetailContex";
import EmployeeDetailPage from "./pages/employee_detail";
import ManagementAttendanceCorrectionPage from "./pages/attendance-correction";
import { DepartmentProvider } from "../Employee/pages/department/DepartmentContext";
import DepartmentDetailPage from "../Employee/pages/department_detail";
import DepartmentPage from "../Employee/pages/department";
import { DepartmentDetailProvider } from "../Employee/pages/department_detail/DepartmentDetailContext";
import { PerformanceProvider } from "../Employee/pages/performance/PerformanceContext";
import PerformancePage from "../Employee/pages/performance";
import PerformanceDetailPage from "../Employee/pages/performanceDetail";
import PerformanceByEmployeePage from "../Employee/pages/performanceByEmployee";
import PerformanceByDepartmentPage from "../Employee/pages/performanceByDepartment";
import AllDepartmentsPerformancePage from "../Employee/pages/performanceByDepartment/AllDepartmentsPerformance";
import PerformanceCriteriaPage from "../Employee/pages/performanceCriteria";
import { TrophyOutlined } from "@ant-design/icons";

const HolidayManagementPage = lazy(
  () => import("../holiday/HolidayManagementPage"),
);

const management_route: RouteItem = {
  path: "/management",
  name: "Quản lý nhân sự",
  element: <MainLayout />,
  icon: <FaUserGroup className="text-base font-primary" />,
  minRoleLevel: ROLE_LEVELS.SIDEBAR_MIN_LEVEL_MANAGEMENT,
  children: [
    {
      path: "leave-applications",
      name: "Đơn nghỉ phép",
      element: (
        <LeaveApplicationProvider>
          <MyLeaveApplicationPage />
        </LeaveApplicationProvider>
      ),
    },
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
      path: "update-requests",
      name: "Yêu cầu cập nhật",
      element: <UpdateRequestPage />,
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
    },
    {
      path: "update-requests/:id",
      name: "Chi tiết yêu cầu cập nhật",
      element: (
        <UpdateRequestDetailProvider>
          <UpdateRequestDetailPage />
        </UpdateRequestDetailProvider>
      ),
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
    },
    {
      path: "contracts",
      name: "Hợp đồng",
      element: (
        <ContractProvider>
          <ManagementContractPage />
        </ContractProvider>
      ),
      icon: <FileTextOutlined />,
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
    },
    {
      path: "contracts/add-new",
      name: "Thêm mới",
      element: (
        <ContractDetailProvider>
          <ContractDetailPage />
        </ContractDetailProvider>
      ),
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
    },
    {
      path: "contracts/:id",
      name: "Chi tiết",
      element: (
        <ContractDetailProvider>
          <ContractDetailPage />
        </ContractDetailProvider>
      ),
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
    },
    {
      path: "meetings",
      name: "Cuộc họp",
      icon: <VideoCameraOutlined />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
      children: [
        {
          path: "add-new",
          name: "Tạo cuộc họp",
          element: <ManagementCreateMeetingPage />,
          icon: <PlusOutlined />,
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
        },
        {
          path: "past",
          name: "Lịch sử cuộc họp",
          element: <ManagementPastMeetingsPage />,
          icon: <HistoryOutlined />,
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
        },
      ],
    },
    {
      path: "meetings/:id",
      name: "Chi tiết cuộc họp",
      element: <ManagementMeetingDetailPage />,
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "video-call",
      name: "Video Call",
      element: <ManagementVideoCall />,
      hideInMenu: true,
      minRoleLevel: 0,
    },
    {
      path: "projects",
      name: "Quản lý dự án",
      element: (
        <ProjectProvider>
          <ProjectPage />
        </ProjectProvider>
      ),
      icon: <FaProjectDiagram className="text-base font-primary" />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "projects/:projectId",
      name: "Chi tiết dự án",
      element: (
        <ProjectDetailProvider>
          <ProjectDetailPage />
        </ProjectDetailProvider>
      ),
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "projects/:projectId/epics/:epicId/tasks",
      name: "Epic Tasks",
      element: (
        <EpicTaskProvider>
          <EpicTaskPage />
        </EpicTaskProvider>
      ),
      hideInMenu: true,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "attendance",
      name: "Chấm công",
      icon: <CalendarOutlined />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
      children: [
        {
          path: "reports",
          name: "Báo cáo chấm công",
          element: <AttendanceManagementPage />,
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
        },
        {
          path: "correction-requests",
          name: "Quản lý đơn điểm danh bù",
          element: <ManagementAttendanceCorrectionPage />,
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
        },
      ],
    },
    {
      path: "holiday",
      name: "Quản lý nghỉ lễ",
      icon: <CalendarOutlined />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
      children: [
        {
          path: "management",
          name: "Quản lý ngày nghỉ",
          element: <HolidayManagementPage />,
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
        },
      ],
      element: <AttendanceManagementPage />,
    },
    {
      path: "holiday/management",
      name: "Quản lý nghỉ lễ",
      element: <HolidayManagementPage />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "performance",
      name: "Đánh giá",
      icon: <TrophyOutlined />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
      children: [
        {
          path: "list",
          name: "Đánh giá",
          minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
          element: (
            <PerformanceProvider>
              <PerformancePage />
            </PerformanceProvider>
          ),
        },
        {
          path: "criteria",
          name: "Tiêu chí đánh giá",
          minRoleLevel: ROLE_LEVELS.HR_LEVEL,
          element: <PerformanceCriteriaPage />,
        },
        {
          path: "department",
          name: "Đánh giá phòng ban",
          minRoleLevel: ROLE_LEVELS.HR_LEVEL,
          element: <AllDepartmentsPerformancePage />,
        },
      ],
    },
    {
      path: "performance/department/:departmentId",
      name: "Chi tiết đánh giá phòng ban",
      minRoleLevel: ROLE_LEVELS.HR_LEVEL,
      element: <PerformanceByDepartmentPage />,
      hideInMenu: true,
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
  ],
};

export default management_route;
