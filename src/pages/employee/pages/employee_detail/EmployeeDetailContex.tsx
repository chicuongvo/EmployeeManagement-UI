/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { getEmployee } from "@/apis/employee/getEmployee";
import type {
  EMPLOYEE,
  GetEmployeeResponse,
} from "@/apis/employee/model/Employee";

interface EmployeeDetailContextType {
  employee: EMPLOYEE | undefined;
  isCreate: boolean;
  editMode: boolean;
  isEditable: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  refetchEmployee: () => void;
  isLoadingEmployee: boolean;
}

const EmployeeDetailContext = createContext<
  EmployeeDetailContextType | undefined
>(undefined);

export const EmployeeDetailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const [editMode, setEditMode] = useState(false);

  const {
    isLoading: isLoadingEmployee,
    data: employeeDetailData,
    refetch: refetchEmployee,
  } = useQuery({
    queryFn: (): Promise<GetEmployeeResponse> => {
      return getEmployee({
        id: Number(params.id) || 0,
      });
    },
    queryKey: ["employee-detail", Number(params.id)],
    enabled: !!Number(params.id),
  });

  const isCreate = useMemo(
    () => pathname.includes("add-new") && !employeeDetailData?.data,
    [pathname, employeeDetailData?.data]
  );

  const isEditable = useMemo(() => editMode || isCreate, [editMode, isCreate]);

  const contextValue = useMemo(
    () => ({
      employee: employeeDetailData?.data || undefined,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchEmployee,
      isLoadingEmployee,
    }),
    [
      employeeDetailData?.data,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchEmployee,
      isLoadingEmployee,
    ]
  );

  return (
    <EmployeeDetailContext.Provider value={contextValue}>
      {children}
    </EmployeeDetailContext.Provider>
  );
};

export const useEmployeeDetailContext = () => {
  const context = useContext(EmployeeDetailContext);
  if (context === undefined) {
    throw new Error(
      "useEmployeeDetailContext must be used within a EmployeeDetailProvider"
    );
  }
  return context;
};
