import { Navigate, type RouteObject } from "react-router-dom";

import employee_route from "./pages/employee/route";
import project_route from "./pages/project/route";
import notification_route from "./pages/notification/route";

export type RouteItem = Omit<RouteObject, "children"> & {
  name?: string;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  icon?: React.ReactNode;
  children?: RouteItem[];
  permissions?: string | string[];
};

export const ROUTER_DASHBOARD = "/employee/employees";

export const DEFAULT_ROUTE = "/employee/employees";

const routes: RouteItem[] = [
  {
    path: "/",
    hideInMenu: true,
    element: <Navigate to={ROUTER_DASHBOARD} replace />,
  } as RouteItem,
  employee_route,
  notification_route,
  project_route,
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
          children: children.map(child => getRoute(child)),
        }
      : { index }),
  };
};

export const getRoutes = () => {
  return routes.map(route => getRoute(route));
};

export default routes;
