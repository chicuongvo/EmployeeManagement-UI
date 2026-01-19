import requestApi from "@/utils/requestApi";
import type {
    GetAttendanceRatioRequest,
    GetAttendanceRatioResponse,
} from "./model/Attendance";

const endpoints = {
    attendance: "/attendance-reports",
};

const getRatio =
    (url: string) =>
        async (params: GetAttendanceRatioRequest): Promise<GetAttendanceRatioResponse> => {
            const { employeeId, month, year } = params;
            return requestApi.get<GetAttendanceRatioResponse>(
                `${url}/ratio/${employeeId}/${month}/${year}`
            );
        };

export const getAttendanceRatio = getRatio(endpoints.attendance);
