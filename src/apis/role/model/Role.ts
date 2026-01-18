import type { PaginationRequest } from "@/types/pagination";
import type { PaginationResponse } from "@/types/pagination";

export interface ROLE {
    id: number;
    name: string;
    level?: number | null;
    status: RoleStatus;
    createdAt: Date | string;
    isDeleted?: boolean;
}

export type RoleStatus = "ACTIVE" | "INACTIVE";

export interface GetListRoleRequest
    extends Omit<PaginationRequest, "name"> {
    name?: string | string[];

    status?: RoleStatus | RoleStatus[] | string | string[];
}

export interface GetListRoleResponse extends PaginationResponse<ROLE> { }

export interface CreateRoleRequest {
    name: string;
    level?: number | null;
    status?: RoleStatus;
}

export interface UpdateRoleRequest {
    name?: string;
    level?: number | null;
    status?: RoleStatus;
}
