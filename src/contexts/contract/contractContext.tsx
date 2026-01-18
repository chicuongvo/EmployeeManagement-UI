import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { ContractContext } from "./contractContext";
import { getAllContracts } from "../../services/contract";
import { mockContracts } from "../../data/mockData";
import type {
  ContractResponse,
  ContractQueryParams,
} from "../../types/Contract";

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<ContractResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<ContractQueryParams>({});

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);

      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter mock data based on queryParams
        let filteredData = [...mockContracts];

        if (queryParams.status) {
          filteredData = filteredData.filter(
            (item) => item.status === queryParams.status
          );
        }

        if (queryParams.type) {
          filteredData = filteredData.filter(
            (item) => item.type === queryParams.type
          );
        }

        if (queryParams.employeeId) {
          filteredData = filteredData.filter(
            (item) => item.employeeId === queryParams.employeeId
          );
        }

        if (queryParams.managerId) {
          filteredData = filteredData.filter(
            (item) => item.signedById === queryParams.managerId
          );
        }

        setContracts(filteredData as ContractResponse[]);
      } else {
        const data = await getAllContracts(queryParams);
        setContracts(data);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  const refreshContracts = useCallback(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        setContracts,
        selectedContract,
        setSelectedContract,
        isLoading,
        setIsLoading,
        queryParams,
        setQueryParams,
        refreshContracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
