import { FaClipboardUser } from "react-icons/fa6";
import { VideoCameraOutlined } from "@ant-design/icons";

import { type RouteItem } from "@/routes";
// import { ROLE_LEVELS } from "@/constants/roleLevel";
import { DepartmentProvider } from "./pages/department/DepartmentContext";
import { LeaveApplicationProvider } from "./pages/leave-application/LeaveApplicationContext";
import MyRequestsPage from "./pages/update-request/my-requests";
import ContractDetailPage from "./pages/contract_detail";
import { ContractDetailProvider } from "./pages/contract_detail/ContractDetailContext";
import UpdateRequestDetailPage from "./pages/update_request_detail";
import { UpdateRequestDetailProvider } from "./pages/update_request_detail/UpdateRequestDetailContext";
import MeetingPage from "./pages/meeting";
import DepartmentPage from "./pages/department";
import LeaveApplicationPage from "./pages/leave-application";
import VideoCall from "./pages/video-call";
import MainLayout from "@/layout/MainLayout";

import DepartmentDetailPage from "./pages/department_detail";
import { DepartmentDetailProvider } from "./pages/department_detail/DepartmentDetailContext";
import EmployeeDetailPage from "@/pages/Management/pages/employee_detail";
import { EmployeeDetailProvider } from "@/pages/Management/pages/employee_detail/EmployeeDetailContex";

// import PerformancePage from "@/pages/Employee/pages/performance";
// import { PerformanceProvider } from "./pages/performance/PerformanceContext";
// import PerformanceDetailPage from "@/pages/Employee/pages/performanceDetail";
// import PerformanceByEmployeePage from "@/pages/Employee/pages/performanceByEmployee";
// import PerformanceByDepartmentPage from "@/pages/Employee/pages/performanceByDepartment";
import MyPerformancePage from "@/pages/employee/pages/myPerformance";
import PerformanceCriteriaPage from "@/pages/employee/pages/performanceCriteria";
import MyProjectsPage from "@/pages/employee/pages/my-projects";
import AttendanceCorrectionPage from "@/pages/employee/pages/attendance-correction";
import MyAttendancePage from "@/pages/employee/pages/my-attendance";

const route: RouteItem = {
  path: "/employee",
  name: (
    <span className="font-primary">Thông tin cá nhân</span>
  ) as unknown as string,
  element: <MainLayout />,
  icon: <FaClipboardUser className="text-base font-primary" />,
  children: [
    {
      path: "me",
      name: "Sơ yếu lí lịch",
      element: (
        <EmployeeDetailProvider>
          <EmployeeDetailPage />
        </EmployeeDetailProvider>
      ),
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
      path: "my-projects",
      name: "Dự án của tôi",
      element: <MyProjectsPage />,
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
      path: "attendance-correction",
      name: "Đơn xin điểm danh bù",
      element: <AttendanceCorrectionPage />,
    },
    {
      path: "my-attendance",
      name: "Lịch sử chấm công",
      element: <MyAttendancePage />,
    },
    {
      path: "my-performance",
      name: "Đánh giá của tôi",
      element: <MyPerformancePage />,
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
