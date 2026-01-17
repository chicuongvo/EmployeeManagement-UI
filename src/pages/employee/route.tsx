import { FaListCheck } from "react-icons/fa6";
import { Outlet } from "react-router-dom";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import EmployeePage from "./pages/employee";
import MainLayout from "@/layout/MainLayout";
import PerformancePage from "@/pages/employee/pages/performance";
import PerformanceDetailPage from "@/pages/employee/pages/performanceDetail";
const route: RouteItem = {
    path: "/employee",
    name: "Employee",
    element: <MainLayout />,
    icon: <FaListCheck className="text-base" />,
    children: [
        {
            path: "employees",
            name: "Employee",
            element: (
                <EmployeeProvider>
                    <EmployeePage />
                </EmployeeProvider>
            ),
        },
        {
            path: "performance",
            name: "Performance",
            element: <Outlet />,
            children: [
                {
                    index: true,
                    name: "Performance",
                    element: <PerformancePage />,
                },
                {
                    path: ":id",
                    name: "Performance Detail",
                    element: <PerformanceDetailPage />,
                },
            ],
        },
    ],
};

export default route;
