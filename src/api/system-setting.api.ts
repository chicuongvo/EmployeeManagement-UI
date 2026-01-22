import { axiosClient } from "../lib/axios";
import type {
  SystemSetting,
  CreateSystemSettingRequest,
  UpdateSystemSettingRequest,
  SystemSettingQueryParams,
  SidebarSettings,
  UploadSettings,
} from "../types/SystemSetting";

// Get all settings
export const getAllSystemSettings = async (
  params?: SystemSettingQueryParams
): Promise<SystemSetting[]> => {
  const response = await axiosClient.get("/system-settings", { params });
  return response.data.data;
};

// Get setting by key
export const getSystemSettingByKey = async (
  key: string
): Promise<SystemSetting> => {
  const response = await axiosClient.get(`/system-settings/${key}`);
  return response.data.data;
};

// Get setting value only
export const getSystemSettingValue = async (
  key: string,
  defaultValue?: string
): Promise<{ key: string; value: string }> => {
  const response = await axiosClient.get(`/system-settings/${key}/value`, {
    params: { defaultValue },
  });
  return response.data.data;
};

// Create or update setting
export const setSystemSetting = async (
  data: CreateSystemSettingRequest
): Promise<SystemSetting> => {
  const response = await axiosClient.post("/system-settings", data);
  return response.data.data;
};

// Update setting by key
export const updateSystemSetting = async (
  key: string,
  data: UpdateSystemSettingRequest
): Promise<SystemSetting> => {
  const response = await axiosClient.put(`/system-settings/${key}`, data);
  return response.data.data;
};

// Delete setting
export const deleteSystemSetting = async (
  key: string
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/system-settings/${key}`);
  return response.data.data;
};

// Refresh cache
export const refreshSystemSettingsCache = async (): Promise<{
  message: string;
}> => {
  const response = await axiosClient.post("/system-settings/cache/refresh");
  return response.data.data;
};

// Seed default settings
export const seedDefaultSystemSettings = async (): Promise<{
  message: string;
}> => {
  const response = await axiosClient.post("/system-settings/seed");
  return response.data.data;
};

// Get sidebar settings
export const getSidebarSettings = async (): Promise<SidebarSettings> => {
  const response = await axiosClient.get("/system-settings/sidebar");
  return response.data.data;
};

// Get upload settings
export const getUploadSettings = async (): Promise<UploadSettings> => {
  const response = await axiosClient.get("/system-settings/upload");
  return response.data.data;
};
