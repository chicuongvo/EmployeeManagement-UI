import requestApi from "@/utils/requestApi";

export interface DailyAttendanceEmployee {
    employeeId: number;
    employee: {
        id: number;
        employeeCode: string;
        fullName: string;
        email: string;
        avatar?: string;
    };
    checkinTime?: string;
    checkoutTime?: string;
    workingTime?: {
        hours: number;
        minutes: number;
        totalMinutes: number;
        formatted: string;
        isOverTenHours: boolean;
    };
    leaveDays: number;
    overLeaveDays: number;
    note?: string;
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
}

export interface DailyAttendanceReport {
    day: number;
    month: number;
    year: number;
    date: string;
    reportId?: number;
    employees: DailyAttendanceEmployee[];
    totalEmployees: number;
    summary: {
        employeesWithCheckIn: number;
        employeesWithoutCheckIn: number;
        employeesOverTenHours: number;
    };
    message?: string;
}

export const getDailyAttendanceReport = async (
    day: number,
    month: number,
    year: number
): Promise<DailyAttendanceReport> => {
    const response = await requestApi.get<{ code: string; data: DailyAttendanceReport }>(
        `/attendance-reports/report/${day}/${month}/${year}`
    );
    return response.data;
};
