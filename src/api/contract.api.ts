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
  params?: ContractQueryParams
): Promise<ContractResponse[]> => {
  const response = await axiosClient.get("/contract", { params });
  // Backend returns { data: ContractResponse[], pagination: {...} }
  const result = response.data.data;
  return Array.isArray(result) ? result : result?.data || [];
};

// Get contract by ID
export const getContractById = async (
  id: number
): Promise<ContractResponse> => {
  const response = await axiosClient.get(`/contract/${id}`);
  return response.data.data;
};

// Create contract
export const createContract = async (
  data: CreateContractRequest | FormData
): Promise<ContractResponse> => {
  const response = await axiosClient.post("/contract", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data.data;
};

// Update contract
export const updateContract = async (
  id: number,
  data: UpdateContractRequest | FormData
): Promise<ContractResponse> => {
  const response = await axiosClient.put(`/contract/${id}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data.data;
};

// Delete contract
export const deleteContract = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/contract/${id}`);
  return response.data;
};

// Update contract status
export const updateContractStatus = async (
  id: number,
  data: UpdateContractStatusRequest
): Promise<ContractResponse> => {
  const response = await axiosClient.patch(`/contract/${id}/status`, data);
  return response.data.data;
};

// Get contracts by employee
export const getContractsByEmployee = async (
  employeeId: number
): Promise<ContractResponse[]> => {
  const response = await axiosClient.get(`/contract/employee/${employeeId}`);
  return response.data.data;
};

// Get contracts by manager
export const getContractsByManager = async (
  managerId: number
): Promise<ContractResponse[]> => {
  const response = await axiosClient.get(`/contract/signed-by/${managerId}`);
  return response.data.data;
};

// Renew contract
export const renewContract = async (
  id: number,
  data: RenewContractRequest
): Promise<ContractResponse> => {
  const response = await axiosClient.post(`/contract/${id}/renew`, data);
  return response.data.data;
};

// Get contract stats
export const getContractStats = async (): Promise<ContractStats> => {
  const response = await axiosClient.get("/contract/stats/overview");
  return response.data.data;
};

