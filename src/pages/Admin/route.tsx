import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import SystemSettings from "./SystemSettings";
import { SettingOutlined } from "@ant-design/icons";
import { ROLE_LEVELS } from "@/constants/roleLevel";

console.log(ROLE_LEVELS);
const admin_route: RouteItem = {
  path: "/admin",
  name: "Quản trị hệ thống",
  element: <MainLayout />,
  icon: <SettingOutlined />,
  minRoleLevel: ROLE_LEVELS.SIDEBAR_MIN_LEVEL_ADMIN,
  children: [
    {
      path: "system-settings",
      name: "Cấu hình hệ thống",
      element: <SystemSettings />,
      minRoleLevel: ROLE_LEVELS.ADMIN_LEVEL,
    },
  ],
};

export default admin_route;
