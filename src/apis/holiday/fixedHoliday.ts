import requestApi from "@/utils/requestApi";

export interface FixedHoliday {
  id: number;
  name: string;
  day: number;
  month: number;
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFixedHolidayDto {
  name: string;
  day: number;
  month: number;
  description?: string;
}

export interface UpdateFixedHolidayDto {
  name?: string;
  day?: number;
  month?: number;
  description?: string;
}

// Get all fixed holidays
export const getAllFixedHolidays = async (): Promise<FixedHoliday[]> => {
  const response = await requestApi.get<{ code: string; data: FixedHoliday[] }>(
    "/holidays/fixed",
  );
  return response.data;
};

// Get fixed holiday by ID
export const getFixedHolidayById = async (
  id: number,
): Promise<FixedHoliday> => {
  const response = await requestApi.get<{ code: string; data: FixedHoliday }>(
    `/holidays/fixed/${id}`,
  );
  return response.data;
};

// Create fixed holiday
export const createFixedHoliday = async (
  data: CreateFixedHolidayDto,
): Promise<FixedHoliday> => {
  const response = await requestApi.post<{
    code: string;
    data: { data: FixedHoliday };
  }>("/holidays/fixed", data);
  return response.data.data;
};

// Update fixed holiday
export const updateFixedHoliday = async (
  id: number,
  data: UpdateFixedHolidayDto,
): Promise<FixedHoliday> => {
  const response = await requestApi.put<{
    code: string;
    data: { data: FixedHoliday };
  }>(`/holidays/fixed/${id}`, data);
  return response.data.data;
};

// Delete fixed holiday
export const deleteFixedHoliday = async (id: number): Promise<void> => {
  await requestApi.delete(`/holidays/fixed/${id}`);
};
