import type { RouteObject } from "react-router-dom";

import employee_route from "./pages/Employee/route";
import management_route from "./pages/Management/route";
import admin_route from "./pages/Admin/route";
import Login from "./pages/Auth/Login";
import ChangePassword from "./pages/Auth/ChangePassword";
import RedirectToDefault from "./components/RedirectToDefault";
// import project_route from "./pages/project/route";
// import attendance_route from "./pages/attendance/route";
// import holiday_route from "./pages/holiday/route";
export type RouteItem = Omit<RouteObject, "children"> & {
  name?: string;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  icon?: React.ReactNode;
  children?: RouteItem[];
  permissions?: string | string[];
  minRoleLevel?: number; // Minimum role level required to access this route
};

export const ROUTER_DASHBOARD = "/management/employees";
export const ROUTER_LOGIN = "/auth/login";

// Default route will be determined dynamically based on user role level
// For users with role level < MANAGEMENT_LEVEL: /employee/me
// For users with role level >= MANAGEMENT_LEVEL: /management/employees
export const DEFAULT_ROUTE = "/management/employees";

const routes: RouteItem[] = [
  {
    path: "/",
    hideInMenu: true,
    element: <RedirectToDefault />,
  } as RouteItem,
  {
    path: "/auth/login",
    hideInMenu: true,
    element: <Login />,
  } as RouteItem,
  {
    path: "/auth/change-password",
    hideInMenu: true,
    element: <ChangePassword />,
  } as RouteItem,
  employee_route,
  // project_route,
  // attendance_route,
  // holiday_route,
  management_route,
  admin_route,
];

const getRoute = ({
  index,
  path,
  element,
  children,
}: RouteItem): RouteObject => {
  return {
    path,
    element: element,
    ...(children
      ? {
          children: children.map((child) => getRoute(child)),
        }
      : { index }),
  };
};

export const getRoutes = () => {
  return routes.map((route) => getRoute(route));
};

export default routes;
