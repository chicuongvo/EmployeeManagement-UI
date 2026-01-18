import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import useGetParam from "@/hooks/useGetParam";
import useTableStore from "@/stores/tableStore";

import { getAllContracts } from "@/api/contract.api";
import type {
  ContractResponse,
  ContractQueryParams,
} from "@/types/Contract";
import { toast } from "react-toastify";

interface GetListContractResponse {
  data: ContractResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ContractContextType {
  params: ContractQueryParams;
  paramsStr: string;
  setPopupContract: React.Dispatch<React.SetStateAction<boolean>>;
  popupContract: boolean;
  setPopupCreateContract: React.Dispatch<React.SetStateAction<boolean>>;
  popupCreateContract: boolean;
  setPopupEditContract: React.Dispatch<React.SetStateAction<boolean>>;
  popupEditContract: boolean;
  refetch: () => void;
  dataResponse?: GetListContractResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: ContractQueryParams) => void;
  setSelectedContract: React.Dispatch<
    React.SetStateAction<ContractResponse | null>
  >;
  selectedContract: ContractResponse | null;
  tab?: string;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [_, setSearchParams] = useSearchParams();
  const { listContractActiveKey } = useTableStore((state) => state);
  const [popupContract, setPopupContract] = useState(false);
  const [popupCreateContract, setPopupCreateContract] = useState(false);
  const [popupEditContract, setPopupEditContract] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ContractResponse | null>(null);

  const status = useGetParam<string>("status", "string");
  const type = useGetParam<string>("type", "string");
  const employeeId = useGetParam<number>("employeeId", "number");
  const signedById = useGetParam<number>("signedById", "number");
  const contractCode = useGetParam<string>("contractCode", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const startDateFrom = useGetParam<string>("start_date_from", "string");
  const startDateTo = useGetParam<string>("start_date_to", "string");
  const endDateFrom = useGetParam<string>("end_date_from", "string");
  const endDateTo = useGetParam<string>("end_date_to", "string");
  const createdDateFrom = useGetParam<string>("created_date_from", "string");
  const createdDateTo = useGetParam<string>("created_date_to", "string");
  const tab = useGetParam<string>("tab");

  const params = useMemo((): ContractQueryParams => {
    return {
      status: status as
        | "DRAFT"
        | "ACTIVE"
        | "EXPIRED"
        | "TERMINATED"
        | "PENDING"
        | "RENEWED"
        | undefined,
      type: type as
        | "FULL_TIME"
        | "PART_TIME"
        | "INTERNSHIP"
        | "PROBATION"
        | "TEMPORARY"
        | "FREELANCE"
        | "OUTSOURCE"
        | undefined,
      employeeId,
      signedById,
      contractCode,
      page,
      limit,
      sort,
      start_date_from: startDateFrom,
      start_date_to: startDateTo,
      end_date_from: endDateFrom,
      end_date_to: endDateTo,
      created_date_from: createdDateFrom,
      created_date_to: createdDateTo,
    };
  }, [
    status,
    type,
    employeeId,
    signedById,
    contractCode,
    page,
    limit,
    sort,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    createdDateFrom,
    createdDateTo,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["contracts", params, tab],
    queryFn: async (): Promise<GetListContractResponse> => {
      const response = await getAllContracts(params);
      
      // If response is already in paginated format
      if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
        return response as GetListContractResponse;
      }
      
      // If response is an array, wrap it
      const dataArray = Array.isArray(response) ? response : [];
      return {
        data: dataArray,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: dataArray.length,
          totalPages: Math.ceil(dataArray.length / (params?.limit || 10)),
        },
      };
    },
    enabled: !!tab,
  });

  const handleFilterSubmit = (values: ContractQueryParams) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          tab: tab ?? 1,
        },
        { arrayFormat: "comma" }
      )
    );
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams(
        queryString.stringify({
          tab: 1,
          page: 1,
          limit: 10,
        })
      );
    }
  }, [setSearchParams, tab]);

  return (
    <ContractContext.Provider
      value={{
        params,
        paramsStr,
        setPopupContract,
        popupContract,
        setPopupCreateContract,
        popupCreateContract,
        setPopupEditContract,
        popupEditContract,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedContract,
        selectedContract,
        tab,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContractContext must be used within a ContractProvider");
  }
  return context;
};

