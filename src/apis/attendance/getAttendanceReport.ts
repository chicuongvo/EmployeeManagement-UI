import requestApi from "@/utils/requestApi";
import type {
    GetAttendanceReportRequest,
    GetAttendanceReportResponse,
} from "./model/Attendance";

const endpoints = {
    attendance: "/attendance-reports",
};

const getReport =
    (url: string) =>
        async (params: GetAttendanceReportRequest): Promise<GetAttendanceReportResponse> => {
            const { month, year } = params;
            return requestApi.get<GetAttendanceReportResponse>(`${url}/report/${month}/${year}`);
        };

export const getAttendanceReport = getReport(endpoints.attendance);
