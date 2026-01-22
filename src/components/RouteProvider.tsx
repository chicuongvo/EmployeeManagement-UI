import React, { createContext, useContext, useEffect, useState } from "react";
import { useSidebarSettings } from "@/hooks/useSystemSettings";
import type { RouteItem } from "@/routes";

interface RouteContextType {
  routes: RouteItem[];
  updateRouteMinLevels: (settings: {
    MANAGEMENT_LEVEL: number;
    HR_LEVEL: number;
    ADMIN_LEVEL: number;
  }) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRouteContext must be used within RouteProvider");
  }
  return context;
};

interface RouteProviderProps {
  children: React.ReactNode;
  initialRoutes: RouteItem[];
}

export const RouteProvider: React.FC<RouteProviderProps> = ({
  children,
  initialRoutes,
}) => {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  const { data: sidebarSettings, isSuccess } = useSidebarSettings();

  const updateRouteMinLevels = (settings: {
    MANAGEMENT_LEVEL: number;
    HR_LEVEL: number;
    ADMIN_LEVEL: number;
  }) => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) => {
        // Update Management routes
        if (route.path === "/management") {
          return {
            ...route,
            minRoleLevel: settings.MANAGEMENT_LEVEL,
            children: route.children?.map((child) => ({
              ...child,
              minRoleLevel: settings.MANAGEMENT_LEVEL,
            })),
          };
        }

        // Update Admin routes
        if (route.path === "/admin") {
          return {
            ...route,
            minRoleLevel: settings.ADMIN_LEVEL,
            children: route.children?.map((child) => ({
              ...child,
              minRoleLevel: settings.ADMIN_LEVEL,
            })),
          };
        }

        // Update HR routes (if any)
        if (route.path === "/hr") {
          return {
            ...route,
            minRoleLevel: settings.HR_LEVEL,
            children: route.children?.map((child) => ({
              ...child,
              minRoleLevel: settings.HR_LEVEL,
            })),
          };
        }

        return route;
      })
    );
  };

  // Update routes when settings are loaded
  useEffect(() => {
    if (isSuccess && sidebarSettings) {
      updateRouteMinLevels(sidebarSettings);
    }
  }, [isSuccess, sidebarSettings]);

  return (
    <RouteContext.Provider value={{ routes, updateRouteMinLevels }}>
      {children}
    </RouteContext.Provider>
  );
};
