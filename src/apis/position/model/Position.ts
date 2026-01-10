import type { PaginationRequest } from "@/types/pagination";

// Position interface matching Prisma schema
export interface POSITION {
  id: number;
  name: string;
  createdAt: Date | string;
  // Relations (optional, included based on API include parameter)
  employees?: Array<{
    id: number;
    fullName: string;
    employeeCode?: string;
  }>;
}

// Request interface for filtering positions
export interface GetListPositionRequest
  extends Omit<PaginationRequest, "name"> {
  // Position fields for filtering (supports OR search)
  name?: string | string[];
}

// Custom pagination metadata
export interface PositionPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response interface for list positions (matches API structure)
export interface GetListPositionResponse {
  data: POSITION[];
  pagination: PositionPaginationMeta;
}

// Create position request
export interface CreatePositionRequest {
  name: string;
}

// Update position request
export interface UpdatePositionRequest {
  name?: string;
}
