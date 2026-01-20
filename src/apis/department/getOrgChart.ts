import axiosApi from "@/utils/axiosApi";

export interface OrgChartEmployee {
  id: number;
  employeeCode: string;
  fullName: string;
  avatar?: string;
  email: string;
  phone: string;
  directManagerId?: number | null;
  directManager?: {
    id: number;
    fullName: string;
    employeeCode: string;
  } | null;
}

export interface OrgChartPosition {
  id: number;
  name: string;
  roleId: number | null;
  roleName: string | null;
  roleLevel: number | null;
  employees: OrgChartEmployee[];
}

export interface OrgChartLevel {
  level: number;
  roleName: string;
  positions: OrgChartPosition[];
}

export interface OrgChartResponse {
  departmentId: number;
  levels: OrgChartLevel[];
}

export const getOrgChart = async (departmentId: number): Promise<OrgChartResponse> => {
  const response = await axiosApi.get<{
    code: string;
    data: OrgChartResponse;
  }>(`/department/${departmentId}/org-chart`);

  return response.data.data;
};

