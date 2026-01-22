import * as systemSettingApi from "../api/system-setting.api";
import type {
  SystemSetting,
  CreateSystemSettingRequest,
  UpdateSystemSettingRequest,
  SystemSettingQueryParams,
  SidebarSettings,
  UploadSettings,
} from "../types/SystemSetting";

export const getAllSystemSettings = async (
  params?: SystemSettingQueryParams
): Promise<SystemSetting[]> => {
  return systemSettingApi.getAllSystemSettings(params);
};

export const getSystemSettingByKey = async (
  key: string
): Promise<SystemSetting> => {
  return systemSettingApi.getSystemSettingByKey(key);
};

export const getSystemSettingValue = async (
  key: string,
  defaultValue?: string
): Promise<string> => {
  const result = await systemSettingApi.getSystemSettingValue(
    key,
    defaultValue
  );
  return result.value;
};

export const setSystemSetting = async (
  data: CreateSystemSettingRequest
): Promise<SystemSetting> => {
  return systemSettingApi.setSystemSetting(data);
};

export const updateSystemSetting = async (
  key: string,
  data: UpdateSystemSettingRequest
): Promise<SystemSetting> => {
  return systemSettingApi.updateSystemSetting(key, data);
};

export const deleteSystemSetting = async (key: string): Promise<void> => {
  await systemSettingApi.deleteSystemSetting(key);
};

export const refreshSystemSettingsCache = async (): Promise<void> => {
  await systemSettingApi.refreshSystemSettingsCache();
};

export const seedDefaultSystemSettings = async (): Promise<void> => {
  await systemSettingApi.seedDefaultSystemSettings();
};

export const getSidebarSettings = async (): Promise<SidebarSettings> => {
  return systemSettingApi.getSidebarSettings();
};

export const getUploadSettings = async (): Promise<UploadSettings> => {
  return systemSettingApi.getUploadSettings();
};

// Utility functions
export const getManagementLevel = async (): Promise<number> => {
  const value = await getSystemSettingValue("MANAGEMENT_LEVEL", "2");
  return parseInt(value) || 2;
};

export const getHRLevel = async (): Promise<number> => {
  const value = await getSystemSettingValue("HR_LEVEL", "3");
  return parseInt(value) || 3;
};

export const getAdminLevel = async (): Promise<number> => {
  const value = await getSystemSettingValue("ADMIN_LEVEL", "4");
  return parseInt(value) || 4;
};

export const getMaxFileUploadSize = async (): Promise<number> => {
  const value = await getSystemSettingValue("MAX_FILE_UPLOAD_SIZE", "10485760");
  return parseInt(value) || 10485760; // 10MB default
};

export const getPaginationDefaultLimit = async (): Promise<number> => {
  const value = await getSystemSettingValue("PAGINATION_DEFAULT_LIMIT", "20");
  return parseInt(value) || 20;
};
