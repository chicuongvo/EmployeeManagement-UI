/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { getContractById } from "@/services/contract";
import type { ContractResponse } from "@/types/Contract";

interface ContractDetailContextType {
  contract: ContractResponse | undefined;
  isCreate: boolean;
  editMode: boolean;
  isEditable: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  refetchContract: () => void;
  isLoadingContract: boolean;
}

const ContractDetailContext = createContext<
  ContractDetailContextType | undefined
>(undefined);

export const ContractDetailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const [editMode, setEditMode] = useState(false);

  const {
    isLoading: isLoadingContract,
    data: contractDetailData,
    refetch: refetchContract,
  } = useQuery({
    queryFn: async (): Promise<ContractResponse> => {
      const contractId = Number(params.id);
      if (!contractId || contractId <= 0) {
        throw new Error("Invalid contract ID");
      }
      return getContractById(contractId);
    },
    queryKey: ["contract-detail", Number(params.id)],
    enabled: !!params.id && Number(params.id) > 0,
  });

  const isCreate = useMemo(
    () => pathname.includes("add-new") && !contractDetailData,
    [pathname, contractDetailData],
  );

  const isEditable = useMemo(() => editMode || isCreate, [editMode, isCreate]);

  const contextValue = useMemo(
    () => ({
      contract: contractDetailData || undefined,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchContract,
      isLoadingContract,
    }),
    [
      contractDetailData,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchContract,
      isLoadingContract,
    ],
  );

  return (
    <ContractDetailContext.Provider value={contextValue}>
      {children}
    </ContractDetailContext.Provider>
  );
};

export const useContractDetailContext = () => {
  const context = useContext(ContractDetailContext);
  if (context === undefined) {
    throw new Error(
      "useContractDetailContext must be used within a ContractDetailProvider",
    );
  }
  return context;
};
