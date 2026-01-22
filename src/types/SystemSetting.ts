export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateSystemSettingRequest {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSystemSettingRequest {
  value: string;
  description?: string;
}

export interface SystemSettingQueryParams {
  key?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface SidebarSettings {
  MANAGEMENT_LEVEL: number;
  HR_LEVEL: number;
}

export interface UploadSettings {
  MAX_FILE_UPLOAD_SIZE: number;
  SESSION_TIMEOUT: number;
}

// Common setting keys
export const SETTING_KEYS = {
  SIDEBAR_MIN_LEVEL_MANAGEMENT: "SIDEBAR_MIN_LEVEL_MANAGEMENT",
  SIDEBAR_MIN_LEVEL_HR: "SIDEBAR_MIN_LEVEL_HR",
  MANAGEMENT_LEVEL: "MANAGEMENT_LEVEL",
  HR_LEVEL: "HR_LEVEL",
  MAX_FILE_UPLOAD_SIZE: "MAX_FILE_UPLOAD_SIZE",
  SESSION_TIMEOUT: "SESSION_TIMEOUT",
  PAGINATION_DEFAULT_LIMIT: "PAGINATION_DEFAULT_LIMIT",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
