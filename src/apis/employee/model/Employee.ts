/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

export interface Department {
  id: number;
  name: string;
  departmentCode: string;
  managerId?: number;
  createdAt: Date;
}

export interface Position {
  id: number;
  name: string;
  createdAt: Date;
}

export interface WorkHistory {
  id: number;
  employeeId: number;
  departmentId: number;
  positionId: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

export type WorkStatus =
  | "WORKING_ONSITE"
  | "WORK_FROM_HOME"
  | "BUSINESS_TRIP"
  | "TRAINING"
  | "ON_LEAVE_PERSONAL"
  | "ON_LEAVE_SICK"
  | "ON_LEAVE_MATERNITY"
  | "ON_LEAVE_VACATION"
  | "OFF_DUTY"
  | "ABSENT"
  | "RESIGNED"
  | "TERMINATED"
  | "RETIRED"
  | "ACTIVE"; // Legacy for backward compatibility
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
  // Note: Employee model doesn't have updatedAt in Prisma schema

  // Relations (optional, included based on API include parameter)
  department?: Department;
  position?: Position;
  managedDepartment?: Department;
  workHistory?: WorkHistory[];
}

export interface GetListEmployeeRequest extends PaginationRequest {
  // Quick search filter (searches in employeeCode and fullName)
  q?: string;
  
  departmentId?: number | number[] | string | string[];
  positionId?: number | number[] | string | string[];
  isActive?: boolean;
  // Personal information filters (supports OR search)
  fullName?: string | string[];
  email?: string | string[];
  phone?: string | string[];
  citizenId?: string | string[];
  employeeCode?: string | string[];
}

export interface GetListEmployeeResponse extends PaginationResponse<EMPLOYEE> {}
