export interface PerformanceDetailScore {
    id: number;
    performanceReportDetailId: number;
    performanceCriteriaId: number;
    score: number;
}

export interface Employee {
    id: number;
    employeeCode: string;
    fullName: string;
    avatar: string | null;
    workStatus: string;
    gender: string;
    birthday: string;
    citizenId: string;
    phone: string;
    email: string;
    ethnicity: string;
    religion: string;
    education: string;
    major: string;
    siNo: string;
    hiNo: string;
    createdAt: string;
    isActive: boolean;
    departmentId: number;
    positionId: number;
    role: string;
}

export interface PerformanceDetail {
    id: number;
    employeeId: number;
    supervisorId: number;
    performanceReportId: number;
    average_score: number | null;
    scores?: PerformanceDetailScore[];
    employee?: Employee;
}

export interface Performance {
    id: number;
    month: number;
    year: number;
    createdAt: string;
    details?: PerformanceDetail[];
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}