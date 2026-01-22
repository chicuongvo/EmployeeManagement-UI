import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import SystemSettings from "./SystemSettings";
import { SettingOutlined } from "@ant-design/icons";

const admin_route: RouteItem = {
  path: "/admin",
  name: "Quản trị hệ thống",
  element: <MainLayout />,
  icon: <SettingOutlined />,
  minRoleLevel: 0, // Will be updated from settings
  children: [
    {
      path: "system-settings",
      name: "Cấu hình hệ thống",
      element: <SystemSettings />,
      minRoleLevel: 0, // Will be updated from settings
    },
  ],
};

export default admin_route;
