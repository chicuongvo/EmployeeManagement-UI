import { BellOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { type RouteItem } from "@/routes";
import { NotificationProvider } from "./NotificationContext";
import NotificationListPage from "./pages/notification-list";
import MainLayout from "@/layout/MainLayout";

const route: RouteItem = {
  path: "/notification",
  name: (<span className="font-primary">Thông báo</span>) as unknown as string,
  element: <MainLayout />,
  icon: <BellOutlined className="text-base font-primary" />,
  hideChildrenInMenu: true,
  children: [
    {
      index: true,
      path: "",
      element: <Navigate to="list" replace />,
      hideInMenu: true,
    },
    {
      path: "list",
      name: "Danh sách thông báo",
      element: (
        <NotificationProvider>
          <NotificationListPage />
        </NotificationProvider>
      ),
    },
  ],
};

export default route;
