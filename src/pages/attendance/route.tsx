import { CalendarOutlined } from "@ant-design/icons";
import type { RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import AttendanceManagementPage from "./AttendanceManagementPage";

const attendance_route: RouteItem = {
    path: "/attendance",
    name: "Chấm công",
    icon: <CalendarOutlined />,
    element: <MainLayout />,
    children: [
        {
            path: "reports",
            name: "Báo cáo chấm công",
            element: <AttendanceManagementPage />,
        },
    ],
};

export default attendance_route;
