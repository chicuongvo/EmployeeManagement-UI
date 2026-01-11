import { FaListCheck } from "react-icons/fa6";

import { type RouteItem } from "@/routes";
import { EmployeeProvider } from "./pages/employee/EmployeeContext";
import EmployeePage from "./pages/employee";
import { UpdateRequestProvider } from "./pages/update-request/UpdateRequestContext";
import UpdateRequestPage from "./pages/update-request";
import MyRequestsPage from "./pages/update-request/my-requests";
import { ContractProvider } from "./pages/contract/ContractContext";
import ContractPage from "./pages/contract";
import MyContractsPage from "./pages/contract/my-contracts";
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
    {
      path: "update-requests",
      name: "Update Request",
      element: (
        <UpdateRequestProvider>
          <UpdateRequestPage />
        </UpdateRequestProvider>
      ),
    },
    {
      path: "my-update-requests",
      name: "Đơn yêu cầu của tôi",
      element: <MyRequestsPage />,
    },
    {
      path: "contracts",
      name: "Hợp đồng",
      element: (
        <ContractProvider>
          <ContractPage />
        </ContractProvider>
      ),
    },
    {
      path: "my-contracts",
      name: "Hợp đồng của tôi",
      element: <MyContractsPage />,
    },
  ],
};

export default route;
