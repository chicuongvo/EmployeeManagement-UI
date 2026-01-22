import { axiosClient } from "../lib/axios";
import type {
  ContractResponse,
  CreateContractRequest,
  UpdateContractRequest,
  UpdateContractStatusRequest,
  RenewContractRequest,
  ContractQueryParams,
  ContractStats,
} from "../types/Contract";

// Get all contracts
export const getAllContracts = async (
  params?: ContractQueryParams,
): Promise<{
  data: ContractResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await axiosClient.get("/contract", { params });
  // Backend returns { code: "SUCCESS", data: { data: ContractResponse[], pagination: {...} } }
  const result = response.data.data;
  // If result has pagination structure, return it
  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    "pagination" in result
  ) {
    return result;
  }
  // Fallback: if it's just an array, wrap it
  const data = Array.isArray(result) ? result : result?.data || [];
  return {
    data,
    pagination: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: data.length,
      totalPages: Math.ceil(data.length / (params?.limit || 10)),
    },
  };
};

// Get contract by ID
export const getContractById = async (
  id: number,
): Promise<ContractResponse> => {
  const response = await axiosClient.get(`/contract/${id}`);
  return response.data.data;
};

// Create contract
export const createContract = async (
  data: CreateContractRequest | FormData,
): Promise<ContractResponse> => {
  const response = await axiosClient.post("/contract", data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data.data;
};

// Update contract
export const updateContract = async (
  id: number,
  data: UpdateContractRequest | FormData,
): Promise<ContractResponse> => {
  const response = await axiosClient.put(`/contract/${id}`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data.data;
};

// Delete contract
export const deleteContract = async (
  id: number,
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/contract/${id}`);
  return response.data;
};

// Update contract status
export const updateContractStatus = async (
  id: number,
  data: UpdateContractStatusRequest,
): Promise<ContractResponse> => {
  const response = await axiosClient.patch(`/contract/${id}/status`, data);
  return response.data.data;
};

// Get contracts by employee
export const getContractsByEmployee = async (
  employeeId: number,
): Promise<ContractResponse[]> => {
  const response = await axiosClient.get(`/contract/employee/${employeeId}`);
  return response.data.data;
};

// Get contracts by manager
export const getContractsByManager = async (
  managerId: number,
): Promise<ContractResponse[]> => {
  const response = await axiosClient.get(`/contract/signed-by/${managerId}`);
  return response.data.data;
};

// Renew contract
export const renewContract = async (
  id: number,
  data: RenewContractRequest,
): Promise<ContractResponse> => {
  const response = await axiosClient.post(`/contract/${id}/renew`, data);
  return response.data.data;
};

// Get contract stats
export const getContractStats = async (): Promise<ContractStats> => {
  const response = await axiosClient.get("/contract/stats/overview");
  return response.data.data;
};

// Extract contract info from PDF
export const extractContractFromPDF = async (
  pdfFile: File,
): Promise<{
  contractCode: string | null;
  type: string;
  startDate: string | null;
  endDate: string | null;
  signedDate: string | null;
  note: string | null;
  employeeName: string | null;
  employeeId: number | null;
  signedByName: string | null;
}> => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const response = await axiosClient.post(
    "/contract/extract-from-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};
