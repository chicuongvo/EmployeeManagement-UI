import { FaUserGroup } from "react-icons/fa6";
import { Outlet } from "react-router-dom";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import { DepartmentProvider } from "./pages/department/DepartmentContext";
import EmployeePage from "./pages/employee";
import { UpdateRequestProvider } from "./pages/update-request/UpdateRequestContext";
import UpdateRequestPage from "./pages/update-request";
import MyRequestsPage from "./pages/update-request/my-requests";
import { ContractProvider } from "./pages/contract/ContractContext";
import ContractPage from "./pages/contract";
import MyContractsPage from "./pages/contract/my-contracts";
import MeetingPage from "./pages/meeting";
import DepartmentPage from "./pages/department";
import VideoCall from "./pages/video-call";
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
      path: "update-requests",
      name: "Update Request",
      element: (
        <UpdateRequestProvider>
          <UpdateRequestPage />
        </UpdateRequestProvider>
      ),
    },
    {
      path: "my-update-requests",
      name: "Đơn yêu cầu của tôi",
      element: <MyRequestsPage />,
    },
    {
      path: "contracts",
      name: "Hợp đồng",
      element: (
        <ContractProvider>
          <ContractPage />
        </ContractProvider>
      ),
    },
    {
      path: "my-contracts",
      name: "Hợp đồng của tôi",
      element: <MyContractsPage />,
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
    {
      path: "meetings",
      name: "Cuộc họp",
      element: <MeetingPage />,
    },
    {
      path: "video-call",
      name: "Video Call",
      hideInMenu: true,
      element: <VideoCall />,
    },
  ],
};

export default route;
