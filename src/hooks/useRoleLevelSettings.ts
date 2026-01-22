import { useEffect } from "react";
import { useSidebarSettings } from "./useSystemSettings";
import { updateRoleLevels, ROLE_LEVELS } from "../constants/roleLevel";

// Hook to load and update role level constants from settings
export const useRoleLevelSettings = () => {
  const { data: sidebarSettings, isLoading, error } = useSidebarSettings();

  useEffect(() => {
    if (sidebarSettings) {
      updateRoleLevels({
        MANAGEMENT_LEVEL: sidebarSettings.MANAGEMENT_LEVEL,
        HR_LEVEL: sidebarSettings.HR_LEVEL,
        ADMIN_LEVEL: sidebarSettings.ADMIN_LEVEL,
        SIDEBAR_MIN_LEVEL_MANAGEMENT: sidebarSettings.MANAGEMENT_LEVEL,
        SIDEBAR_MIN_LEVEL_HR: sidebarSettings.HR_LEVEL,
        SIDEBAR_MIN_LEVEL_ADMIN: sidebarSettings.ADMIN_LEVEL,
      });
    }
  }, [sidebarSettings]);

  return {
    roleLevels: ROLE_LEVELS,
    isLoading,
    error,
    isReady: !isLoading && !error && !!sidebarSettings,
  };
};
