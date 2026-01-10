import type { PaginationRequest } from "@/types/pagination";

// Employee interface (simplified for manager relation)
export interface DepartmentManager {
  id: number;
  employeeCode?: string;
  fullName: string;
  email: string;
  phone: string;
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
}

// Request interface for filtering departments
export interface GetListDepartmentRequest
  extends Omit<PaginationRequest, "name"> {
  // Department fields for filtering (supports OR search)
  name?: string | string[];
  departmentCode?: string | string[];
  description?: string | string[];
}

// Custom pagination metadata
export interface DepartmentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response interface for list departments (matches API structure)
export interface GetListDepartmentResponse {
  data: DEPARTMENT[];
  pagination: DepartmentPaginationMeta;
}

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
