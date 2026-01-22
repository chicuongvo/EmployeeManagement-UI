/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

// Employee interface (simplified for manager relation)
export interface DepartmentManager {
  id: number;
  employeeCode?: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
}

// Department interface matching Prisma schema
export interface DEPARTMENT {
  id: number;
  departmentCode: string;
  name: string;
  foundedAt: Date | string;
  description?: string | null;
  createdAt: Date | string;
  managerId?: number | null;
  manager?: DepartmentManager | null;
  employees?: Array<{
    id: number;
    fullName: string;
    employeeCode?: string;
  }>;
  status: "ACTIVE" | "INACTIVE";
}

// Request interface for filtering departments
export interface GetListDepartmentRequest
  extends Omit<PaginationRequest, "name"> {
  // Quick search filter (searches in departmentCode and name)
  q?: string;

  // Department fields for filtering (supports OR search)
  name?: string | string[];
  departmentCode?: string | string[];
  description?: string | string[];

  // Manager filter (supports single ID, comma-separated IDs, or array)
  managerId?: number | number[] | string | string[];

  // Date range filters (Unix timestamps in seconds)
  // Support both naming conventions for backward compatibility
  created_at_from?: number;
  created_at_to?: number;
  created_date_from?: number; // Legacy support
  created_date_to?: number; // Legacy support

  // Updated date filters (requires updatedAt field in Department schema)
  updated_at_from?: number;
  updated_at_to?: number;
  // Legacy support: treating updated_by as updated_at
  updated_by_from?: number;
  updated_by_to?: number;
}

// Custom pagination metadata
export interface DepartmentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response interface for list departments (matches API structure)
export interface GetListDepartmentResponse
  extends PaginationResponse<DEPARTMENT> {}
// Create department request
export interface CreateDepartmentRequest {
  departmentCode: string;
  name: string;
  foundedAt: Date | string;
  description?: string;
  managerId?: number;
}

// Update department request
export interface UpdateDepartmentRequest {
  departmentCode?: string;
  name?: string;
  foundedAt?: Date | string;
  description?: string;
  managerId?: number;
}
