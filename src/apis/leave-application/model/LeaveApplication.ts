import type { BaseResponse } from "@/types/common";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

export interface Employee {
  id: number;
  name: string;
  employeeCode: string;
}

export interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
}

export type LeaveApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveApplication {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveApplicationStatus;
  createdAt: string;
  employeeId: number;
  leaveTypeId: number;
  employee?: Employee;
  leaveType?: LeaveType;
}

export interface GetListLeaveApplicationRequest extends PaginationRequest {
  startDate?: string;
  endDate?: string;
  status?: LeaveApplicationStatus;
  employeeId?: number;
  leaveTypeId?: number;
}

export interface GetListLeaveApplicationResponse
  extends PaginationResponse<LeaveApplication> {}

export interface GetLeaveApplicationRequest {
  applicationId: number;
}

export interface GetLeaveApplicationResponse
  extends BaseResponse<LeaveApplication> {}

export interface CreateLeaveApplicationRequest {
  startDate: string;
  endDate: string;
  reason: string;
  employeeId: number;
  leaveTypeId: number;
}

export interface CreateLeaveApplicationResponse
  extends BaseResponse<LeaveApplication> {}

export interface UpdateLeaveApplicationRequest {
  status?: LeaveApplicationStatus;
  reason?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  leaveTypeId?: number;
}

export interface UpdateLeaveApplicationResponse
  extends BaseResponse<LeaveApplication> {}

export interface DeleteLeaveApplicationResponse extends BaseResponse<{}> {}
