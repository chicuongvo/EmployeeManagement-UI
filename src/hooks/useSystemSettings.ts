import { useQuery } from "@tanstack/react-query";
import * as systemSettingService from "../services/system-setting";
import type {
  SystemSetting,
  SidebarSettings,
  UploadSettings,
} from "../types/SystemSetting";

// Hook to get all settings
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: () => systemSettingService.getAllSystemSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific setting by key
export const useSystemSetting = (key: string, defaultValue?: string) => {
  return useQuery({
    queryKey: ["system-setting", key],
    queryFn: () =>
      systemSettingService.getSystemSettingValue(key, defaultValue),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!key,
  });
};

// Hook to get sidebar settings
export const useSidebarSettings = () => {
  return useQuery({
    queryKey: ["system-settings", "sidebar"],
    queryFn: () => systemSettingService.getSidebarSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get upload settings
export const useUploadSettings = () => {
  return useQuery({
    queryKey: ["system-settings", "upload"],
    queryFn: () => systemSettingService.getUploadSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get management level
export const useManagementLevel = () => {
  return useQuery({
    queryKey: ["system-settings", "management-level"],
    queryFn: () => systemSettingService.getManagementLevel(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get HR level
export const useHRLevel = () => {
  return useQuery({
    queryKey: ["system-settings", "hr-level"],
    queryFn: () => systemSettingService.getHRLevel(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get Admin level
export const useAdminLevel = () => {
  return useQuery({
    queryKey: ["system-settings", "admin-level"],
    queryFn: () => systemSettingService.getAdminLevel(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to check if user has required level for sidebar access
export const useSidebarAccess = (userLevel: number) => {
  const { data: sidebarSettings } = useSidebarSettings();

  return {
    canAccessManagement: userLevel >= (sidebarSettings?.MANAGEMENT_LEVEL || 2),
    canAccessHR: userLevel >= (sidebarSettings?.HR_LEVEL || 3),
    canAccessAdmin: userLevel >= (sidebarSettings?.ADMIN_LEVEL || 4),
    managementLevel: sidebarSettings?.MANAGEMENT_LEVEL || 2,
    hrLevel: sidebarSettings?.HR_LEVEL || 3,
    adminLevel: sidebarSettings?.ADMIN_LEVEL || 4,
  };
};
    managementLevel: sidebarSettings?.MANAGEMENT_LEVEL || 2,
    hrLevel: sidebarSettings?.HR_LEVEL || 3,
  };
};
