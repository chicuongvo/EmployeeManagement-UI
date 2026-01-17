/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { PaginationRequest } from "@/types/pagination";
import type { PaginationResponse } from "@/types/pagination";

// Position interface matching Prisma schema
export interface POSITION {
  id: number;
  name: string;
  status: PositionStatus;
  createdAt: Date | string;
  // Relations (optional, included based on API include parameter)
  employees?: Array<{
    id: number;
    fullName: string;
    employeeCode?: string;
  }>;
}

export type PositionStatus = "ACTIVE" | "INACTIVE";

// Request interface for filtering positions
export interface GetListPositionRequest
  extends Omit<PaginationRequest, "name"> {
  // Position fields for filtering (supports OR search)
  name?: string | string[];

  // Status filter (supports single status, comma-separated, or array)
  status?: PositionStatus | PositionStatus[] | string | string[];
}

// Custom pagination metadata
export interface PositionPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response interface for list positions (matches API structure)
export interface GetListPositionResponse extends PaginationResponse<POSITION> {}

// Create position request
export interface CreatePositionRequest {
  name: string;
  status?: PositionStatus; // Optional, defaults to ACTIVE
}

// Update position request
export interface UpdatePositionRequest {
  name?: string;
  status?: PositionStatus; // Allow updating status
}
