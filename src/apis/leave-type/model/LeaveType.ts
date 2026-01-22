import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

export interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
  isDeleted: boolean;
}

export interface GetListLeaveTypeRequest extends PaginationRequest {
  name?: string;
  isDeleted?: boolean;
}

export type GetListLeaveTypeResponse = PaginationResponse<LeaveType>;
