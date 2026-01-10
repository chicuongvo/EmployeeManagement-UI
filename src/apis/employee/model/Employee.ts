import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

export interface Department {
    id: number;
    name: string;
    departmentCode: string;
    managerId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Position {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkHistory {
    id: number;
    employeeId: number;
    departmentId: number;
    positionId: number;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type WorkStatus = "ACTIVE" | "RESIGNED" | "TERMINATED" | "RETIRED";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Education =
    | "HIGH_SCHOOL"
    | "ASSOCIATE_DEGREE"
    | "BACHELOR_DEGREE"
    | "MASTER_DEGREE"
    | "DOCTORATE_DEGREE"
    | "POST_DOCTORAL"
    | "VOCATIONAL_TRAINING"
    | "OTHER";

export interface EMPLOYEE {
    id: number;
    employeeCode: string;
    fullName: string;
    avatar?: string;
    gender: Gender;
    birthday: Date;
    citizenId: string;
    phone: string;
    email: string;
    ethnicity?: string;
    religion?: string;
    education?: string;
    major?: string;
    siNo?: string; // Social Insurance Number
    hiNo?: string; // Health Insurance Number
    departmentId: number;
    positionId: number;
    workStatus: WorkStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relations (optional, included based on API include parameter)
    department?: Department;
    position?: Position;
    managedDepartment?: Department;
    workHistory?: WorkHistory[];
}

export interface GetListEmployeeRequest extends PaginationRequest {
    department?: string | string[];
    position?: string | string[];
    isActive?: boolean;
    // Personal information filters (supports OR search)
    fullName?: string | string[];
    email?: string | string[];
    phone?: string | string[];
    citizenId?: string | string[];
    employeeCode?: string | string[];
}

export interface GetListEmployeeResponse extends PaginationResponse<EMPLOYEE> { }