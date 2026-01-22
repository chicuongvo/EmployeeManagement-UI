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
import { performanceService } from "@/apis/performance/performanceService";
import type { Performance, Pagination } from "@/apis/performance/performanceService";

export interface GetListPerformanceRequest {
  q?: string;
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface GetListPerformanceResponse {
  data: {
    data: Performance[];
    pagination: Pagination;
  };
}

interface PerformanceContextType {
  params: GetListPerformanceRequest;
  paramsStr: string;
  refetch: () => void;
  dataResponse?: GetListPerformanceResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListPerformanceRequest) => void;
  setSelectedPerformance: React.Dispatch<React.SetStateAction<Performance | null>>;
  selectedPerformance: Performance | null;
  setPopupAddPerformance: React.Dispatch<React.SetStateAction<boolean>>;
  popupAddPerformance: boolean;
  tab?: string;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export const PerformanceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  const [popupAddPerformance, setPopupAddPerformance] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);

  const q = useGetParam<string>("q", "string");
  const month = useGetParam<number>("month", "number");
  const year = useGetParam<number>("year", "number");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  const params = useMemo((): GetListPerformanceRequest => {
    return {
      q,
      month,
      year,
      page,
      limit,
      sort,
    };
  }, [q, month, year, page, limit, sort]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["performances", params, tab],
    queryFn: async (): Promise<GetListPerformanceResponse> => {
      const response = await performanceService.getAll({
        page: params.page || 1,
        limit: params.limit || 10,
        q: params.q,
        month: params.month,
        year: params.year,
        sort: params.sort,
      });
      
      return {
        data: response,
      };
    },
    enabled: !!tab,
  });

  const handleFilterSubmit = (values: GetListPerformanceRequest) => {
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
    <PerformanceContext.Provider
      value={{
        params,
        paramsStr,
        refetch,
        dataResponse: data,
        isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedPerformance,
        selectedPerformance,
        setPopupAddPerformance,
        popupAddPerformance,
        tab,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error(
      "usePerformanceContext must be used within a PerformanceProvider"
    );
  }
  return context;
};
