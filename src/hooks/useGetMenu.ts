import type { MenuDataItem } from "@ant-design/pro-components";
import routes, { type RouteItem } from "../routes";

const useGetMenus = (): MenuDataItem[] => {
  const getMenu = (menu: RouteItem): MenuDataItem => {
    return {
      path: menu.path,
      hideInMenu: menu.hideInMenu,
      hideChildrenInMenu: menu.hideChildrenInMenu,
      name: menu.name || "",
      icon: menu.icon,
      children: menu.children
        ? menu.children.map((child) => getMenu(child))
        : undefined,
      permissions: menu.permissions,
    };
  };

  return routes.map((route) => getMenu(route));
};

export default useGetMenus;
