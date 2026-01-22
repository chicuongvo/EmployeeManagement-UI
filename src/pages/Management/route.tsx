import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import UpdateRequestPage from "./pages/update-request";

const management_route: RouteItem = {
  path: "/management",
  name: "Quản lý nhân sự",
  element: <MainLayout />,
  icon: "",
  minRoleLevel: 2, // Will be updated from settings
  children: [
    {
      path: "update-requests",
      name: "Quản lí yêu cầu cập nhật",
      element: <UpdateRequestPage />,
      minRoleLevel: 2, // Will be updated from settings
    },
  ],
};

export default management_route;
