import requestApi from "@/utils/requestApi";

export interface LeaveTypeUsed {
    leaveTypeId: number;
    leaveTypeName: string;
    maxDays: number;
    daysUsed: number;
    daysOver: number;
}

export interface MonthlyAttendanceEmployee {
    employeeId: number;
    employee: {
        id: number;
        employeeCode: string;
        fullName: string;
        email: string;
    };
    attendanceRatio: number;
    expectedWorkingDays: number;
    leaveDays: number;
    overLeaveDays: number;
    actualWorkingDays: number;
    totalWorkingTime: {
        hours: number;
        minutes: number;
        totalMinutes: number;
        formatted: string;
    };
    daysWithoutCheckIn: number[];
    daysWithoutCheckInCount: number;
    daysOverTenHours: Array<{
        day: number;
        timeWorked: {
            hours: number;
            minutes: number;
            totalMinutes: number;
            formatted: string;
        };
    }>;
    daysOverTenHoursCount: number;
    leaveTypesUsed: LeaveTypeUsed[];
}

export interface MonthlyAttendanceReport {
    month: number;
    year: number;
    employees: MonthlyAttendanceEmployee[];
    totalEmployees: number;
}

export const getMonthlyAttendanceReport = async (
    month: number,
    year: number
): Promise<MonthlyAttendanceReport> => {
    const response = await requestApi.get<{ code: string; data: MonthlyAttendanceReport }>(
        `/attendance-reports/report/${month}/${year}`
    );
    return response.data;
};
