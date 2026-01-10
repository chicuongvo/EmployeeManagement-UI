import { FaListCheck } from "react-icons/fa6";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import EmployeePage from "./pages/employee";
import MainLayout from "@/layout/MainLayout";

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

    ],
};

export default route;
