import { useMemo } from "react";
import { useRoleLevelSettings } from "./useRoleLevelSettings";
import routes, { type RouteItem } from "@/routes";

// Hook to filter routes based on user level and settings
export const useRouteAccess = (userLevel: number) => {
  const { isReady } = useRoleLevelSettings();

  const accessibleRoutes = useMemo(() => {
    if (!isReady) {
      return []; // Return empty array while loading
    }

    const filterRoutes = (routeList: RouteItem[]): RouteItem[] => {
      const filteredRoutes: RouteItem[] = [];

      for (const route of routeList) {
        // Check if user has access to this route
        const requiredLevel = route.minRoleLevel || 1;

        if (userLevel >= requiredLevel) {
          // Filter children recursively
          const filteredChildren = route.children
            ? filterRoutes(route.children)
            : undefined;

          filteredRoutes.push({
            ...route,
            children: filteredChildren,
          });
        }
      }

      return filteredRoutes;
    };

    return filterRoutes(routes);
  }, [userLevel, isReady]);

  return {
    accessibleRoutes,
    isLoading: !isReady,
  };
};

// Hook to check specific route access
export const useCanAccessRoute = (userLevel: number, routePath: string) => {
  const { roleLevels, isReady } = useRoleLevelSettings();

  return useMemo(() => {
    if (!isReady) return false;

    let requiredLevel = 1;

    if (routePath.startsWith("/management")) {
      requiredLevel = roleLevels.SIDEBAR_MIN_LEVEL_MANAGEMENT;
    } else if (routePath.startsWith("/admin")) {
      requiredLevel = roleLevels.SIDEBAR_MIN_LEVEL_ADMIN;
    } else if (routePath.startsWith("/hr")) {
      requiredLevel = roleLevels.SIDEBAR_MIN_LEVEL_HR;
    }

    return userLevel >= requiredLevel;
  }, [userLevel, routePath, roleLevels, isReady]);
};
