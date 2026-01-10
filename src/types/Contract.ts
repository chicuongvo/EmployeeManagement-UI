export type ContractType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "PROBATION"
  | "TEMPORARY"
  | "FREELANCE"
  | "OUTSOURCE";

export type ContractStatus =
  | "DRAFT"
  | "ACTIVE"
  | "EXPIRED"
  | "TERMINATED"
  | "PENDING"
  | "RENEWED";

export type ContractResponse = {
  id: number;
  contractCode: string;
  type: ContractType;
  startDate: string;
  endDate: string;
  signedDate: string;
  status: ContractStatus;
  dailySalary: number;
  allowance: number;
  note?: string | null;
  attachment?: string | null;
  createdAt: string;
  signedById: number;
  employeeId: number;
  employee?: {
    id: number;
    fullName: string;
    email: string;
  };
  signedBy?: {
    id: number;
    fullName: string;
    email: string;
  };
};

export type CreateContractRequest = {
  contractCode?: string; // Optional - backend sẽ tự động generate
  type: ContractType;
  startDate: string;
  endDate: string;
  signedDate: string;
  status?: ContractStatus;
  dailySalary: number;
  allowance: number;
  note?: string;
  attachment?: string;
  signedById?: number; // Optional - backend sẽ tự động lấy từ token
  employeeId: number;
};

export type UpdateContractRequest = Partial<
  Omit<CreateContractRequest, "contractCode" | "employeeId">
>;

export type UpdateContractStatusRequest = {
  status: ContractStatus;
};

export type RenewContractRequest = {
  startDate: string;
  endDate: string;
  signedDate: string;
  dailySalary: number;
  allowance: number;
  note?: string;
};

export type ContractQueryParams = {
  page?: number;
  limit?: number;
  status?: ContractStatus;
  type?: ContractType;
  employeeId?: number;
  managerId?: number;
};

export type ContractStats = {
  total: number;
  active: number;
  expired: number;
  draft: number;
  terminated: number;
  pending: number;
  renewed: number;
};

