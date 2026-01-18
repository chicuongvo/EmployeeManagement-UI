import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import {
  getListLeaveApplication,
  createLeaveApplication,
  updateLeaveApplication,
  deleteLeaveApplication,
} from "@/apis/leave-application";
import type {
  GetListLeaveApplicationRequest,
  GetListLeaveApplicationResponse,
  LeaveApplication,
  CreateLeaveApplicationRequest,
  UpdateLeaveApplicationRequest,
} from "@/apis/leave-application";

interface LeaveApplicationContextType {
  params: GetListLeaveApplicationRequest;
  paramsStr: string;
  setPopupCreateLeaveApplication: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  popupCreateLeaveApplication: boolean;
  setPopupUpdateLeaveApplication: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  popupUpdateLeaveApplication: boolean;
  refetch: () => void;
  dataResponse?: GetListLeaveApplicationResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListLeaveApplicationRequest) => void;
  setSelectedLeaveApplication: React.Dispatch<
    React.SetStateAction<LeaveApplication | null>
  >;
  selectedLeaveApplication: LeaveApplication | null;
  createLeaveApplicationMutation: ReturnType<
    typeof useMutation<
      any,
      any,
      CreateLeaveApplicationRequest,
      unknown
    >
  >;
  updateLeaveApplicationMutation: ReturnType<
    typeof useMutation<
      any,
      any,
      { id: number; data: UpdateLeaveApplicationRequest },
      unknown
    >
  >;
  deleteLeaveApplicationMutation: ReturnType<
    typeof useMutation<any, any, number, unknown>
  >;
  tab?: string;
}

const LeaveApplicationContext = createContext<
  LeaveApplicationContextType | undefined
>(undefined);

export const LeaveApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [popupCreateLeaveApplication, setPopupCreateLeaveApplication] =
    useState(false);
  const [popupUpdateLeaveApplication, setPopupUpdateLeaveApplication] =
    useState(false);
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState<LeaveApplication | null>(null);

  const status = useGetParam<string>("status", "string");
  const employeeId = useGetParam<number>("employeeId", "number");
  const leaveTypeId = useGetParam<number>("leaveTypeId", "number");
  const startDate = useGetParam<string>("startDate", "string");
  const endDate = useGetParam<string>("endDate", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  const params = useMemo((): GetListLeaveApplicationRequest => {
    return {
      status: status as any,
      employeeId,
      leaveTypeId,
      startDate,
      endDate,
      page,
      limit,
      sort,
    };
  }, [status, employeeId, leaveTypeId, startDate, endDate, page, limit, sort]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["leave-applications", params, tab],
    queryFn: (): Promise<GetListLeaveApplicationResponse> => {
      return getListLeaveApplication(params);
    },
    enabled: !!tab,
  });

  const createLeaveApplicationMutation = useMutation({
    mutationFn: (data: CreateLeaveApplicationRequest) =>
      createLeaveApplication(data),
    onSuccess: () => {
      refetch();
      setPopupCreateLeaveApplication(false);
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
  });

  const updateLeaveApplicationMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateLeaveApplicationRequest;
    }) => updateLeaveApplication(id, data),
    onSuccess: () => {
      refetch();
      setPopupUpdateLeaveApplication(false);
      setSelectedLeaveApplication(null);
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
  });

  const deleteLeaveApplicationMutation = useMutation({
    mutationFn: (id: number) => deleteLeaveApplication(id),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
  });

  const handleFilterSubmit = (values: GetListLeaveApplicationRequest) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          date_range_picker: undefined,
          tab: tab ?? "1",
        },
        { arrayFormat: "comma" }
      )
    );
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams(
        queryString.stringify({
          tab: "1",
          page: 1,
          limit: 10,
        })
      );
    }
  }, [setSearchParams, tab]);

  return (
    <LeaveApplicationContext.Provider
      value={{
        params,
        paramsStr,
        setPopupCreateLeaveApplication,
        popupCreateLeaveApplication,
        setPopupUpdateLeaveApplication,
        popupUpdateLeaveApplication,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedLeaveApplication,
        selectedLeaveApplication,
        createLeaveApplicationMutation,
        updateLeaveApplicationMutation,
        deleteLeaveApplicationMutation,
        tab,
      }}
    >
      {children}
    </LeaveApplicationContext.Provider>
  );
};

export const useLeaveApplicationContext = () => {
  const context = useContext(LeaveApplicationContext);
  if (!context) {
    throw new Error(
      "useLeaveApplicationContext must be used within a LeaveApplicationProvider"
    );
  }
  return context;
};
