/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { BaseResponse } from "@/types/common";

export interface AttendanceReportDetail {
    id: number;
    employeeId: number;
    attendanceReportId: number;
    leaveDays: number;
    overLeaveDays: number;
    note?: string;
    createdAt: Date;

    // Calculated fields (from API)
    attendanceRatio?: number;
    expectedWorkingDays?: number;
    actualWorkingDays?: number;

    // Relations
    employee?: {
        id: number;
        employeeCode: string;
        fullName: string;
        email: string;
        avatar?: string;
        department?: {
            id: number;
            name: string;
        };
        position?: {
            id: number;
            name: string;
        };
    };
}

export interface AttendanceReport {
    id: number;
    month: number;
    year: number;
    createdAt: Date;
    details?: AttendanceReportDetail[];
}

export interface GetAttendanceReportRequest {
    month: number;
    year: number;
}

export interface GetAttendanceReportResponse extends BaseResponse<AttendanceReport> { }

export interface GetAttendanceRatioRequest {
    employeeId: number;
    month: number;
    year: number;
}

export interface AttendanceRatioData {
    attendanceRatio: number;
    expectedWorkingDays: number;
    leaveDays: number;
    overLeaveDays: number;
    actualWorkingDays: number;
}

export interface GetAttendanceRatioResponse extends BaseResponse<AttendanceRatioData> { }

export interface GetAttendanceReportsRequest {
    from: string | Date;
    to: string | Date;
}

export interface GetAttendanceReportsResponse extends BaseResponse<AttendanceReport[]> { }
