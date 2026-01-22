import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import UpdateRequestPage from "./pages/update-request";
import ManagementPastMeetingsPage from "./pages/meetings/past";
import ManagementVideoCall from "./pages/video-call";
import ManagementCreateMeetingPage from "./pages/meetings/create";
import ManagementMeetingDetailPage from "./pages/meetings/detail";
import { ContractProvider } from "../Employee/pages/contract/ContractContext";
import ContractPage from "../Employee/pages/contract";
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
} from "@ant-design/icons";
import { FaUserGroup } from "react-icons/fa6";

import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import EmployeePage from "./pages/employee";

import EmployeeDetailPage from "./pages/employee_detail";
import { EmployeeDetailProvider } from "./pages/employee_detail/EmployeeDetailContex";

const management_route: RouteItem = {
  path: "/management",
  name: "Quản lý nhân sự",
  element: <MainLayout />,
  icon: <FaUserGroup className="text-base font-primary" />,
  minRoleLevel: ROLE_LEVELS.SIDEBAR_MIN_LEVEL_MANAGEMENT,
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
      name: "Quản lí yêu cầu cập nhật",
      element: <UpdateRequestPage />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
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
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
    {
      path: "contracts",
      name: "Hợp đồng",
      element: (
        <ContractProvider>
          <ContractPage />
        </ContractProvider>
      ),
      icon: <FileTextOutlined />,
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
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
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
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
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
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
          name: "Cuộc họp đã kết thúc",
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
      minRoleLevel: ROLE_LEVELS.MANAGEMENT_LEVEL,
    },
  ],
};

export default management_route;
