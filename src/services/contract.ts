import * as contractApi from "../api/contract.api";
import type {
  ContractResponse,
  CreateContractRequest,
  UpdateContractRequest,
  UpdateContractStatusRequest,
  RenewContractRequest,
  ContractQueryParams,
  ContractStats,
} from "../types/Contract";

export const getAllContracts = async (
  params?: ContractQueryParams
): Promise<ContractResponse[]> => {
  return contractApi.getAllContracts(params);
};

export const getContractById = async (
  id: number
): Promise<ContractResponse> => {
  return contractApi.getContractById(id);
};

export const createContract = async (
  data: CreateContractRequest | FormData
): Promise<ContractResponse> => {
  return contractApi.createContract(data);
};

export const updateContract = async (
  id: number,
  data: UpdateContractRequest | FormData
): Promise<ContractResponse> => {
  return contractApi.updateContract(id, data);
};

export const deleteContract = async (
  id: number
): Promise<{ message: string }> => {
  return contractApi.deleteContract(id);
};

export const updateContractStatus = async (
  id: number,
  data: UpdateContractStatusRequest
): Promise<ContractResponse> => {
  return contractApi.updateContractStatus(id, data);
};

export const getContractsByEmployee = async (
  employeeId: number
): Promise<ContractResponse[]> => {
  return contractApi.getContractsByEmployee(employeeId);
};

export const getContractsByManager = async (
  managerId: number
): Promise<ContractResponse[]> => {
  return contractApi.getContractsByManager(managerId);
};

export const renewContract = async (
  id: number,
  data: RenewContractRequest
): Promise<ContractResponse> => {
  return contractApi.renewContract(id, data);
};

export const getContractStats = async (): Promise<ContractStats> => {
  return contractApi.getContractStats();
};

