import { Navigate, type RouteObject } from "react-router-dom";

import employee_route from "./pages/Employee/route";
import management_route from "./pages/Management/route";
import admin_route from "./pages/Admin/route";
import Login from "./pages/Auth/Login";

export type RouteItem = Omit<RouteObject, "children"> & {
  name?: string;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  icon?: React.ReactNode;
  children?: RouteItem[];
  permissions?: string | string[];
  minRoleLevel?: number; // Minimum role level required to access this route
};

export const ROUTER_DASHBOARD = "/employee/employees";
export const ROUTER_LOGIN = "/auth/login";

export const DEFAULT_ROUTE = "/employee/employees";

const routes: RouteItem[] = [
  {
    path: "/",
    hideInMenu: true,
    element: <Navigate to={ROUTER_DASHBOARD} replace />,
  } as RouteItem,
  {
    path: "/auth/login",
    hideInMenu: true,
    element: <Login />,
  } as RouteItem,
  employee_route,
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
