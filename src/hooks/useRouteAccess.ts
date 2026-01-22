import { useMemo } from "react";
import { useSidebarSettings } from "./useSystemSettings";
import type { RouteItem } from "@/routes";

// Hook to filter routes based on user level and settings
export const useRouteAccess = (userLevel: number, routes: RouteItem[]) => {
  const { data: sidebarSettings, isLoading } = useSidebarSettings();

  const accessibleRoutes = useMemo(() => {
    if (isLoading || !sidebarSettings) {
      return routes; // Return all routes while loading
    }

    const filterRoutes = (routeList: RouteItem[]): RouteItem[] => {
      return routeList
        .map((route) => {
          // Get required level from settings based on route path
          let requiredLevel = route.minRoleLevel || 1;

          if (route.path === "/management") {
            requiredLevel = sidebarSettings.MANAGEMENT_LEVEL;
          } else if (route.path === "/admin") {
            requiredLevel = sidebarSettings.ADMIN_LEVEL;
          } else if (route.path === "/hr") {
            requiredLevel = sidebarSettings.HR_LEVEL;
          }

          // Check if user has access to this route
          if (userLevel < requiredLevel) {
            return null; // User doesn't have access
          }

          // Filter children recursively
          const filteredChildren = route.children
            ? filterRoutes(route.children)
            : undefined;

          return {
            ...route,
            minRoleLevel: requiredLevel,
            children: filteredChildren,
          };
        })
        .filter((route): route is RouteItem => route !== null);
    };

    return filterRoutes(routes);
  }, [routes, userLevel, sidebarSettings, isLoading]);

  return {
    accessibleRoutes,
    isLoading,
    settings: sidebarSettings,
  };
};

// Hook to check specific route access
export const useCanAccessRoute = (userLevel: number, routePath: string) => {
  const { data: sidebarSettings } = useSidebarSettings();

  return useMemo(() => {
    if (!sidebarSettings) return false;

    let requiredLevel = 1;

    if (routePath.startsWith("/management")) {
      requiredLevel = sidebarSettings.MANAGEMENT_LEVEL;
    } else if (routePath.startsWith("/admin")) {
      requiredLevel = sidebarSettings.ADMIN_LEVEL;
    } else if (routePath.startsWith("/hr")) {
      requiredLevel = sidebarSettings.HR_LEVEL;
    }

    return userLevel >= requiredLevel;
  }, [userLevel, routePath, sidebarSettings]);
};
