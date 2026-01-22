import { CalendarOutlined } from "@ant-design/icons";
import { lazy } from "react";
import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";

const HolidayManagementPage = lazy(() => import("./HolidayManagementPage"));

const holiday_route: RouteItem = {
  path: "/holiday",
  name: "Quản lý nghỉ lễ",
  element: <MainLayout />,
  icon: <CalendarOutlined />,
  children: [
    {
      path: "management",
      name: "Quản lý ngày nghỉ",
      element: <HolidayManagementPage />,
    },
  ],
};

export default holiday_route;
