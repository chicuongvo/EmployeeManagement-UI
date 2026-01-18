/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { PaginationRequest } from "@/types/pagination";
import type { PaginationResponse } from "@/types/pagination";
import type { DEPARTMENT } from "@/apis/department";
import type { ROLE } from "@/apis/role";
import type { EMPLOYEE } from "@/apis/employee/model/Employee";

// Position interface matching Prisma schema
export interface POSITION {
  id: number;
  name: string;
  status: PositionStatus;
  createdAt: Date | string;
  parentPositionId?: number | null;
  roleId?: number | null;
  departmentId?: number | null;
  // Relations (optional, included based on API include parameter)
  parentPosition?: POSITION | null;
  childPositions?: POSITION[];
  department?: DEPARTMENT | null;
  role?: ROLE | null;
  employees?: EMPLOYEE[];
}

export type PositionStatus = "ACTIVE" | "INACTIVE";

// Request interface for filtering positions
export interface GetListPositionRequest extends Omit<PaginationRequest, "name"> {
  // Position fields for filtering (supports OR search)
  name?: string | string[];

  // Status filter (supports single status, comma-separated, or array)
  status?: PositionStatus | PositionStatus[] | string | string[];

  departmentId?: number | number[] | string | string[];
  roleId?: number | number[] | string | string[];
  parentPositionId?: number | number[] | string | string[];
}

// Custom pagination metadata
export interface PositionPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response interface for list positions (matches API structure)
export interface GetListPositionResponse extends PaginationResponse<POSITION> { }

// Create position request
export interface CreatePositionRequest {
  name: string;
  status?: PositionStatus; // Optional, defaults to ACTIVE
  parentPositionId?: number | null;
  roleId?: number | null;
  departmentId?: number | null;
}

// Update position request
export interface UpdatePositionRequest {
  name?: string;
  status?: PositionStatus; // Allow updating status
  parentPositionId?: number | null;
  roleId?: number | null;
  departmentId?: number | null;
}
