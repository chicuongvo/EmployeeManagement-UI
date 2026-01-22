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
import { useUser } from "@/hooks/useUser";

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

interface MyLeaveApplicationContextType {
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
  currentUserEmployeeId?: number;
}

const MyLeaveApplicationContext = createContext<
  MyLeaveApplicationContextType | undefined
>(undefined);

export const MyLeaveApplicationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { userProfile } = useUser();
  const [popupCreateLeaveApplication, setPopupCreateLeaveApplication] =
    useState(false);
  const [popupUpdateLeaveApplication, setPopupUpdateLeaveApplication] =
    useState(false);
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState<LeaveApplication | null>(null);

  const status = useGetParam<string>("status", "string");
  const leaveTypeId = useGetParam<number>("leaveTypeId", "number");
  const startDate = useGetParam<string>("startDate", "string");
  const endDate = useGetParam<string>("endDate", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  // Always use current user's employeeId
  const currentUserEmployeeId = userProfile?.id;

  const params = useMemo((): GetListLeaveApplicationRequest => {
    return {
      status: status as any,
      employeeId: currentUserEmployeeId, // Always filter by current user
      leaveTypeId,
      startDate,
      endDate,
      page,
      limit,
      sort,
    };
  }, [
    status,
    currentUserEmployeeId,
    leaveTypeId,
    startDate,
    endDate,
    page,
    limit,
    sort,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["my-leave-applications", params, tab, currentUserEmployeeId],
    queryFn: (): Promise<GetListLeaveApplicationResponse> => {
      return getListLeaveApplication(params);
    },
    enabled: !!tab && !!currentUserEmployeeId,
  });

  const createLeaveApplicationMutation = useMutation({
    mutationFn: (data: CreateLeaveApplicationRequest) =>
      createLeaveApplication(data),
    onSuccess: () => {
      refetch();
      setPopupCreateLeaveApplication(false);
      queryClient.invalidateQueries({ queryKey: ["my-leave-applications"] });
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
      queryClient.invalidateQueries({ queryKey: ["my-leave-applications"] });
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
  });

  const deleteLeaveApplicationMutation = useMutation({
    mutationFn: (id: number) => deleteLeaveApplication(id),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["my-leave-applications"] });
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
    },
  });

  const handleFilterSubmit = (values: GetListLeaveApplicationRequest) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          employeeId: undefined, // Remove employeeId from params as it's always current user
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
    <MyLeaveApplicationContext.Provider
      value={{
        params,
        paramsStr,
        setPopupCreateLeaveApplication,
        popupCreateLeaveApplication,
        popupUpdateLeaveApplication,
        setPopupUpdateLeaveApplication,
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
        currentUserEmployeeId,
      }}
    >
      {children}
    </MyLeaveApplicationContext.Provider>
  );
};

export const useMyLeaveApplicationContext = () => {
  const context = useContext(MyLeaveApplicationContext);
  if (!context) {
    throw new Error(
      "useMyLeaveApplicationContext must be used within a MyLeaveApplicationProvider"
    );
  }
  return context;
};
