import { StarOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { type RouteItem } from "@/routes";
import MainLayout from "@/layout/MainLayout";
import PerformanceRoute from "./pages/performance-evaluation/route";
import AttendanceRoute from "./pages/attendance-evaluation/route";
import PerformanceDetailPage from "./pages/performance-evaluation-detail";

const route: RouteItem = {
    path: "/evaluation",
    name: (<span className="font-primary">Đánh giá</span>) as unknown as string,
    element: <MainLayout />,
    icon: <StarOutlined className="text-base font-primary" />,
    children: [
        {
            index: true,
            path: "",
            element: <Navigate to="performance" replace />,
            hideInMenu: true,
        },
        {
            path: "performance",
            name: "Đánh giá hiệu suất",
            element: <PerformanceRoute />,
        },
        {
            path: "performance/:id",
            name: "Chi tiết đánh giá hiệu suất",
            element: <PerformanceDetailPage />,
            hideInMenu: true,
        },
        {
            path: "attendance",
            name: "Đánh giá chuyên cần",
            element: <AttendanceRoute />,
        },
    ],
};

export default route;
