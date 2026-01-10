import { FaUserGroup } from "react-icons/fa6";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import EmployeePage from "./pages/employee";
import MainLayout from "@/layout/MainLayout";

const route: RouteItem = {
  path: "/employee",
  name: "Hồ sơ nhân viên",
  element: <MainLayout />,
  icon: <FaUserGroup className="text-base" />,
  children: [
    {
      path: "employees",
      name: "Hồ sơ nhân sự",
      element: (
        <EmployeeProvider>
          <EmployeePage />
        </EmployeeProvider>
      ),
    },
  ],
};

export default route;
