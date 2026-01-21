import requestApi from "@/utils/requestApi";

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  day: number;
  description?: string;
  type: "fixed" | "annual";
}

export const getHolidays = async (
  month: number,
  year: number,
): Promise<Holiday[]> => {
  const response = await requestApi.get<{ code: string; data: Holiday[] }>(
    `/attendance-reports/holidays/${month}/${year}`,
  );
  return response.data;
};
