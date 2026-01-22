// This file will be populated with actual values from settings
// These are fallback values, actual values will be loaded from API
export const ROLE_LEVELS = {
  MANAGEMENT_LEVEL: 2,
  HR_LEVEL: 3,
  ADMIN_LEVEL: 4,
  SIDEBAR_MIN_LEVEL_MANAGEMENT: 2,
  SIDEBAR_MIN_LEVEL_HR: 3,
  SIDEBAR_MIN_LEVEL_ADMIN: 4,
};

// Function to update role levels from settings
export const updateRoleLevels = (settings: Record<string, number>) => {
  Object.assign(ROLE_LEVELS, settings);
};
