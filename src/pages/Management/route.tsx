import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import UpdateRequestPage from "./pages/update-request";
import { getManagementLevel } from "@/services/system-setting";

// Get management level from settings
const getManagementMinLevel = async () => {
  try {
    return await getManagementLevel();
  } catch (error) {
    console.error("Failed to get management level from settings:", error);
    return 2; // fallback to default
  }
};

const management_route: RouteItem = {
  path: "/management",
  name: "Quản lý nhân sự",
  element: <MainLayout />,
  icon: "",
  minRoleLevel: 2, // Will be updated dynamically
  children: [
    {
      path: "update-requests",
      name: "Quản lí yêu cầu cập nhật",
      element: <UpdateRequestPage />,
      minRoleLevel: 3, // Will be updated dynamically
    },
  ],
};

// Update minRoleLevel from settings
getManagementMinLevel().then((level) => {
  management_route.minRoleLevel = level;
  if (management_route.children) {
    management_route.children.forEach((child) => {
      if (child.minRoleLevel !== undefined) {
        child.minRoleLevel = level;
      }
    });
  }
});

export default management_route;
