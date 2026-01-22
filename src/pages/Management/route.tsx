import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import UpdateRequest from "./pages/update-request/UpdateRequest";
const management_route: RouteItem = {
  path: "/management",
  name: "Quản lý nhân sự",
  element: <MainLayout />,
  icon: "",
  children: [
    {
      path: "update-requests",
      name: "Quản lý ngày nghỉ",
      element: <UpdateRequest />,
    },
  ],
};

export default management_route;
