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

import { getListDepartment } from "@/apis/department/getListDepartment";
import type {
  DEPARTMENT,
  GetListDepartmentRequest,
  GetListDepartmentResponse,
} from "@/apis/department/model/Department";
import type {
  GetListPositionRequest,
  GetListPositionResponse,
} from "@/apis/position/model/Position";
import { TABS } from ".";
import { getListPosition } from "@/apis/position";
// import { useUpdateEmployee } from "@/apis/employee/createUpdateEmployee";
// import { getListFile, GetListFileResponse } from "@/apis/files/getListFile";

interface DepartmentContextType {
  params: GetListDepartmentRequest;
  paramsStr: string;
  setPopupUpdateEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  popupUpdateEmployee: boolean;
  refetch: () => void;
  dataResponse?: GetListDepartmentResponse | GetListPositionResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (
    values: GetListDepartmentRequest | GetListPositionRequest
  ) => void;
  setSelectedDepartment: React.Dispatch<
    React.SetStateAction<DEPARTMENT | null>
  >;
  selectedDepartment: DEPARTMENT | null;
  // updateDepartmentStatus: (id: number, isActive: boolean) => void;
  tab?: string;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

export const DepartmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  //   const { listEmployeeActiveKey } = useTableStore((state) => state);
  const [popupUpdateEmployee, setPopupUpdateEmployee] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DEPARTMENT | null>(null);

  const generalCode = useGetParam<string>("general_code", "string");
  const generalCodeType = useGetParam<string>(
    "general_code_type",
    "string",
    "q"
  );
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  // Date range filters - support both naming conventions
  const created_date_from = useGetParam<number>("created_date_from", "number");
  const created_date_to = useGetParam<number>("created_date_to", "number");

  // Updated date filters (requires updatedAt field in Department schema)
  const updated_date_from = useGetParam<number>("updated_date_from", "number");
  const updated_date_to = useGetParam<number>("updated_date_to", "number");

  const name = useGetParam<string>("name", "string");
  const departmentCode = useGetParam<string>("departmentCode", "string");
  const description = useGetParam<string>("description", "string");
  const managerId = useGetParam<number>("managerId", "number");

  const params = useMemo((): GetListDepartmentRequest => {
    return {
      name,
      departmentCode,
      description,
      managerId,
      page,
      limit,
      sort,
      // Support both naming conventions for backward compatibility
      created_date_from: created_date_from,
      created_date_to: created_date_to,
      updated_date_from: updated_date_from,
      updated_date_to: updated_date_to,
      general_code: generalCode,
      general_code_type: generalCodeType,
    };
  }, [
    name,
    departmentCode,
    description,
    managerId,
    page,
    limit,
    sort,
    created_date_from,
    created_date_to,
    updated_date_from,
    updated_date_to,
    generalCode,
    generalCodeType,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["departments", params, tab],
    queryFn: (): Promise<
      GetListDepartmentResponse | GetListPositionResponse
    > => {
      const modifiedParams = {
        ...params,
        [`${params.general_code_type ?? ""}`]: params.general_code
          ? params.general_code.trim()
          : undefined,
      };

      modifiedParams.general_code = undefined;
      modifiedParams.general_code_type = undefined;
      return tab === TABS.DEPARTMENT
        ? getListDepartment(modifiedParams)
        : getListPosition(modifiedParams);
    },

    //   return getListDepartment(modifiedParams);
    // },
    enabled: !!tab,
  });

  const handleFilterSubmit = (
    values: GetListDepartmentRequest | GetListPositionRequest
  ) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          created_range_picker: undefined,
          updated_range_picker: undefined,
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
    <DepartmentContext.Provider
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
        setSelectedDepartment,
        selectedDepartment,
        // updateEmployeeStatus,
        tab,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartmentContext = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error(
      "useDepartmentContext must be used within an DepartmentProvider"
    );
  }
  return context;
};
