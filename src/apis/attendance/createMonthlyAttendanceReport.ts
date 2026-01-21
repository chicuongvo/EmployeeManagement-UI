import requestApi from "@/utils/requestApi";

export interface CreateMonthlyReportResponse {
    message: string;
    month: number;
    year: number;
    daysInMonth: number;
    totalDetailsCreated: number;
    dailyReports: Array<{
        day: number;
        detailsCreated: number;
    }>;
}

export const createMonthlyAttendanceReport = async (
    month: number,
    year: number
): Promise<CreateMonthlyReportResponse> => {
    const response = await requestApi.post<{ code: string; data: CreateMonthlyReportResponse }>(
        `/attendance-reports/report/${month}/${year}`,
        {}
    );
    return response.data;
};
