import type { MenuDataItem } from "@ant-design/pro-components";
import { useContext } from "react";
import routes, { type RouteItem } from "../routes";
import { UserContext } from "../contexts/user/userContext";
import { useRoleLevelSettings } from "./useRoleLevelSettings";

const useGetMenus = (): MenuDataItem[] => {
  const userContext = useContext(UserContext);
  const roleLevel = userContext?.roleLevel ?? null;
  const { isReady } = useRoleLevelSettings();

  const hasAccess = (menu: RouteItem): boolean => {
    // If user has no role level, deny access
    if (roleLevel === null) {
      return false;
    }

    // If no minRoleLevel is specified, allow access
    if (menu.minRoleLevel === undefined) {
      return true;
    }

    // Check if user's role level is >= required level
    return roleLevel >= menu.minRoleLevel;
  };

  const getMenu = (menu: RouteItem): MenuDataItem | null => {
    // Check if user has access to this menu item
    if (!hasAccess(menu)) {
      return null;
    }

    // Filter children based on access
    const accessibleChildren = menu.children
      ? menu.children
          .map((child) => getMenu(child))
          .filter((child): child is MenuDataItem => child !== null)
      : undefined;

    return {
      path: menu.path,
      hideInMenu: menu.hideInMenu,
      hideChildrenInMenu: menu.hideChildrenInMenu,
      name: menu.name || "",
      icon: menu.icon,
      children:
        accessibleChildren && accessibleChildren.length > 0
          ? accessibleChildren
          : undefined,
      permissions: menu.permissions,
    };
  };

  // Return empty array while settings are loading to prevent showing routes with wrong levels
  if (!isReady) {
    return [];
  }

  return routes
    .map((route) => getMenu(route))
    .filter((menu): menu is MenuDataItem => menu !== null);
};

export default useGetMenus;
