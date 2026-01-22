import { axiosClient } from "@/lib/axios";
import type { Performance, PerformanceDetail } from "./model/Performance";

export type { Performance, PerformanceDetail };

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface PerformanceResponseAll {
    code: string;
    data: { 
        data: Performance[];
        pagination: Pagination;
    };
}

interface PerformanceResponse {
    code: string;
    data: Performance;
}

// Types for employee performance API
export interface EmployeePerformanceItem {
    reportId: number;
    month: number;
    year: number;
    createdAt: string;
    detailId: number;
    averageScore: number | null;
    supervisorId: number;
    supervisor: {
        id: number;
        employeeCode: string;
        fullName: string;
        avatar: string | null;
    } | null;
    scores: Array<{
        id: number;
        performanceReportDetailId: number;
        performanceCriteriaId: number;
        score: number;
        performanceCriteria: {
            id: number;
            name: string;
            description: string;
        };
    }>;
}

export interface EmployeePerformanceResponse {
    code: string;
    data: {
        employee: {
            id: number;
            employeeCode: string;
            fullName: string;
            avatar: string | null;
            email: string;
            phone: string;
            departmentId: number;
            positionId: number;
            department: { id: number; name: string } | null;
            position: { id: number; name: string } | null;
        } | null;
        performanceHistory: EmployeePerformanceItem[];
    };
}

// Types for department performance API
export interface DepartmentPerformanceDetail {
    id: number;
    employeeId: number;
    supervisorId: number;
    performanceReportId: number;
    average_score: number | null;
    employee: {
        id: number;
        employeeCode: string;
        fullName: string;
        avatar: string | null;
        email: string;
        phone: string;
        departmentId: number;
        positionId: number;
        department: { id: number; name: string } | null;
        position: { id: number; name: string } | null;
    };
    supervisor: {
        id: number;
        employeeCode: string;
        fullName: string;
        avatar: string | null;
    } | null;
    scores: Array<{
        id: number;
        performanceReportDetailId: number;
        performanceCriteriaId: number;
        score: number;
        performanceCriteria: {
            id: number;
            name: string;
            description: string;
        };
    }>;
}

export interface DepartmentPerformanceResponse {
    code: string;
    data: {
        department: {
            id: number;
            name: string;
            departmentCode: string;
            manager: {
                id: number;
                fullName: string;
                avatar: string | null;
            } | null;
        } | null;
        month: number;
        year: number;
        report: {
            id: number;
            createdAt: string;
            details: DepartmentPerformanceDetail[];
        } | null;
    };
}

export interface GetPerformanceParams {
    page?: number;
    limit?: number;
    q?: string;
    month?: number;
    year?: number;
    sort?: string;
}

export interface GetPerformanceListResponse {
    data: Performance[];
    pagination: Pagination;
}

export const performanceService = {
    getAll: async (params?: GetPerformanceParams): Promise<GetPerformanceListResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.q) queryParams.append('q', params.q);
        if (params?.month) queryParams.append('month', params.month.toString());
        if (params?.year) queryParams.append('year', params.year.toString());
        if (params?.sort) queryParams.append('sort', params.sort);
        
        const queryString = queryParams.toString();
        const url = `/performance${queryString ? `?${queryString}` : ''}`;
        
        const { data } = await axiosClient.get<PerformanceResponseAll>(url);
        return data.data;
    },

    getById: async (id: number): Promise<Performance> => {
        const { data } = await axiosClient.get<PerformanceResponse>(
            `/performance/${id}`,
        );
        return data.data;
    },

    create: async (month: number, year: number): Promise<Performance> => {
        const { data } = await axiosClient.post<PerformanceResponse>(
            "/performance",
            { month, year },
        );
        return data.data;
    },

    /**
     * Get performance history of an employee
     * @param employeeId - Employee ID
     * @param month - Optional month filter
     * @param year - Optional year filter
     */
    getByEmployeeId: async (
        employeeId: number,
        month?: number,
        year?: number
    ): Promise<EmployeePerformanceResponse["data"]> => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        
        const queryString = params.toString();
        const url = `/performance/employee/${employeeId}${queryString ? `?${queryString}` : ""}`;
        
        const { data } = await axiosClient.get<EmployeePerformanceResponse>(url);
        return data.data;
    },

    /**
     * Get all employees' performance in a department for a specific month/year
     * @param departmentId - Department ID
     * @param month - Month (required)
     * @param year - Year (required)
     */
    getByDepartmentId: async (
        departmentId: number,
        month: number,
        year: number
    ): Promise<DepartmentPerformanceResponse["data"]> => {
        const { data } = await axiosClient.get<DepartmentPerformanceResponse>(
            `/performance/department/${departmentId}?month=${month}&year=${year}`
        );
        return data.data;
    },
};
