import type { BaseResponse } from "@/types/common";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

export interface WORK_HISTORY {
    id: number;
    employeeId: number;
    departmentId: number;
    positionId: number;
    startDate: string | Date;
    endDate?: string | Date | null;
    note?: string | null;
    createdAt: string | Date;
    isDeleted: boolean;
    department: {
        id: number;
        name: string;
        departmentCode: string;
    };
    position: {
        id: number;
        name: string;
    };
    employee: {
        id: number;
        fullName: string;
        employeeCode: string;
    };
}

export interface GetWorkHistoryListRequest extends PaginationRequest {
    employeeId?: number;
    departmentId?: number;
    positionId?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export interface GetWorkHistoryListResponse extends PaginationResponse<WORK_HISTORY> { }

export interface GetWorkHistoryRequest {
    id: number;
}

export interface GetWorkHistoryResponse extends BaseResponse<WORK_HISTORY> { }