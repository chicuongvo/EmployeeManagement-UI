import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import SystemSettings from "./SystemSettings";
import { SettingOutlined } from "@ant-design/icons";

const admin_route: RouteItem = {
  path: "/admin",
  name: "Quản trị hệ thống",
  element: <MainLayout />,
  icon: <SettingOutlined />,
  minRoleLevel: 3, // Require admin level
  children: [
    {
      path: "system-settings",
      name: "Cấu hình hệ thống",
      element: <SystemSettings />,
      minRoleLevel: 3,
    },
  ],
};

export default admin_route;
