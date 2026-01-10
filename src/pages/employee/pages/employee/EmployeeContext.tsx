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
// import useTableStore from "@/stores/tableStore";

import { getListEmployee } from "@/apis/employee/getListEmployee";
import type {
  GetListEmployeeRequest,
  GetListEmployeeResponse,
  EMPLOYEE,
} from "@/apis/employee/model/Employee";
// import { useUpdateEmployee } from "@/apis/employee/createUpdateEmployee";
// import { getListFile, GetListFileResponse } from "@/apis/files/getListFile";

interface EmployeeContextType {
  params: GetListEmployeeRequest;
  paramsStr: string;
  setPopupUpdateEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  popupUpdateEmployee: boolean;
  refetch: () => void;
  dataResponse?: GetListEmployeeResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListEmployeeRequest) => void;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<EMPLOYEE | null>>;
  selectedEmployee: EMPLOYEE | null;
  // updateEmployeeStatus: (id: number, isActive: boolean) => void;
  tab?: string;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const EmployeeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  //   const { listEmployeeActiveKey } = useTableStore((state) => state);
  const [popupUpdateEmployee, setPopupUpdateEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EMPLOYEE | null>(
    null
  );

  const generalCode = useGetParam<string>("general_code", "string");
  const generalCodeType = useGetParam<string>(
    "general_code_type",
    "string",
    "fullName"
  );
  const departmentId = useGetParam<string>("departmentId", "string");
  const positionId = useGetParam<string>("positionId", "string");
  const isActiveParam = useGetParam<string>("isActive", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");
  const createdDateFrom = useGetParam<number>("created_date_from", "number");
  const createdDateTo = useGetParam<number>("created_date_to", "number");
  const updatedDateFrom = useGetParam<number>("updated_date_from", "number");
  const updatedDateTo = useGetParam<number>("updated_date_to", "number");

  const params = useMemo((): GetListEmployeeRequest => {
    return {
      general_code: generalCode,
      general_code_type: generalCodeType,
      departmentId,
      positionId,
      isActive:
        isActiveParam === "true"
          ? true
          : isActiveParam === "false"
          ? false
          : undefined,
      page,
      limit,
      sort,
      created_date_from: createdDateFrom,
      created_date_to: createdDateTo,
      updated_date_from: updatedDateFrom,
      updated_date_to: updatedDateTo,
    };
  }, [
    generalCode,
    generalCodeType,
    departmentId,
    positionId,
    isActiveParam,
    page,
    limit,
    sort,
    createdDateFrom,
    createdDateTo,
    updatedDateFrom,
    updatedDateTo,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["employees", params, tab],
    queryFn: (): Promise<GetListEmployeeResponse> => {
      const modifiedParams = {
        ...params,
        [`${params.general_code_type ?? ""}`]: params.general_code
          ? params.general_code.trim()
          : undefined,
      };

      modifiedParams.general_code = undefined;
      modifiedParams.general_code_type = undefined;
      return getListEmployee(modifiedParams);
    },
    enabled: !!tab,
  });

  const handleFilterSubmit = (values: GetListEmployeeRequest) => {
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

  // const { mutate: updateEmployeeMutation } = useUpdateEmployee(0, {
  //     onSuccess: () => {
  //         refetch();
  //     },
  // });

  // const updateEmployeeStatus = (id: number, isActive: boolean) => {
  //     updateEmployeeMutation({
  //         id,
  //         isActive,
  //     });
  // };

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
    <EmployeeContext.Provider
      value={{
        params,
        paramsStr,
        setPopupUpdateEmployee,
        popupUpdateEmployee,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedEmployee,
        selectedEmployee,
        // updateEmployeeStatus,
        tab,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};
