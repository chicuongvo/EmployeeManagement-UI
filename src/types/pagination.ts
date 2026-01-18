export interface PaginationRequest {
    ids?: number | string;
    page?: number;
    limit?: number;
    sort?: string;
    name?: string;
    statuses?: number | string | (number | string)[];
    codes?: string;
    search?: string;
    created_date_from?: number;
    created_date_to?: number;
    updated_date_from?: number;
    updated_date_to?: number;
    general_code?: string;
    general_code_type?: string;
    fields?: string;
    created_range_picker?: [number, number];
    updated_range_picker?: [number, number];
    q?: string;
    generalCode?: string;
    generalCodeType?: string;

}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginationResponse<T> {
    code: string;
    data: {
        data: T[];
        pagination: PaginationMeta;
    };
}