import requestApi from "@/utils/requestApi";

export interface AnnualHoliday {
  id: number;
  name: string;
  date: string;
  year: number;
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnualHolidayDto {
  name: string;
  date: string;
  year: number;
  description?: string;
}

export interface UpdateAnnualHolidayDto {
  name?: string;
  date?: string;
  description?: string;
}

// Get all annual holidays
export const getAllAnnualHolidays = async (
  year?: number,
): Promise<AnnualHoliday[]> => {
  const response = await requestApi.get<{
    code: string;
    data: AnnualHoliday[];
  }>("/holidays/annual", {
    params: year ? { year } : undefined,
  });
  return response.data;
};

// Get annual holiday by ID
export const getAnnualHolidayById = async (
  id: number,
): Promise<AnnualHoliday> => {
  const response = await requestApi.get<{ code: string; data: AnnualHoliday }>(
    `/holidays/annual/${id}`,
  );
  return response.data;
};

// Create annual holiday
export const createAnnualHoliday = async (
  data: CreateAnnualHolidayDto,
): Promise<AnnualHoliday> => {
  const response = await requestApi.post<{
    code: string;
    data: { data: AnnualHoliday };
  }>("/holidays/annual", data);
  return response.data.data;
};

// Update annual holiday
export const updateAnnualHoliday = async (
  id: number,
  data: UpdateAnnualHolidayDto,
): Promise<AnnualHoliday> => {
  const response = await requestApi.put<{
    code: string;
    data: { data: AnnualHoliday };
  }>(`/holidays/annual/${id}`, data);
  return response.data.data;
};

// Delete annual holiday
export const deleteAnnualHoliday = async (id: number): Promise<void> => {
  await requestApi.delete(`/holidays/annual/${id}`);
};
