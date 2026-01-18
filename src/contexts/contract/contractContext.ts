import { createContext } from "react";
import type { ContractResponse, ContractQueryParams } from "../../types/Contract";

export interface ContractContextType {
  contracts: ContractResponse[];
  setContracts: React.Dispatch<React.SetStateAction<ContractResponse[]>>;
  selectedContract: ContractResponse | null;
  setSelectedContract: React.Dispatch<
    React.SetStateAction<ContractResponse | null>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryParams: ContractQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<ContractQueryParams>>;
  refreshContracts: () => void;
}

export const ContractContext = createContext<ContractContextType | null>(null);

