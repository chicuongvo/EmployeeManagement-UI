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
// import { useUpdateEmployee } from "@/apis/employee/createUpdateEmployee";
// import { getListFile, GetListFileResponse } from "@/apis/files/getListFile";

interface DepartmentContextType {
  params: GetListDepartmentRequest;
  paramsStr: string;
  setPopupUpdateEmployee: React.Dispatch<React.SetStateAction<boolean>>;
  popupUpdateEmployee: boolean;
  refetch: () => void;
  dataResponse?: GetListDepartmentResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListDepartmentRequest) => void;
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
  const createdDateFrom = useGetParam<number>("created_date_from", "number");
  const createdDateTo = useGetParam<number>("created_date_to", "number");
  const createdAtFrom = useGetParam<number>("created_at_from", "number");
  const createdAtTo = useGetParam<number>("created_at_to", "number");

  // Updated date filters (requires updatedAt field in Department schema)
  const updatedAtFrom = useGetParam<number>("updated_at_from", "number");
  const updatedAtTo = useGetParam<number>("updated_at_to", "number");
  const updatedByFrom = useGetParam<number>("updated_by_from", "number");
  const updatedByTo = useGetParam<number>("updated_by_to", "number");

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
      created_at_from: createdAtFrom || createdDateFrom,
      created_at_to: createdAtTo || createdDateTo,
      created_date_from: createdDateFrom, // Legacy support
      created_date_to: createdDateTo, // Legacy support
      // Updated date filters (requires schema changes to work)
      updated_at_from: updatedAtFrom || updatedByFrom,
      updated_at_to: updatedAtTo || updatedByTo,
      updated_by_from: updatedByFrom, // Legacy support (treated as updated_at)
      updated_by_to: updatedByTo, // Legacy support (treated as updated_at)
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
    createdDateFrom,
    createdDateTo,
    createdAtFrom,
    createdAtTo,
    updatedAtFrom,
    updatedAtTo,
    updatedByFrom,
    updatedByTo,
    generalCode,
    generalCodeType,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["departments", params, tab],
    queryFn: (): Promise<GetListDepartmentResponse> => {
      const modifiedParams = {
        ...params,
        [`${params.general_code_type ?? ""}`]: params.general_code
          ? params.general_code.trim()
          : undefined,
      };

      modifiedParams.general_code = undefined;
      modifiedParams.general_code_type = undefined;
      return getListDepartment(modifiedParams);
    },

    //   return getListDepartment(modifiedParams);
    // },
    enabled: !!tab,
  });

  console.log("data", data);

  const handleFilterSubmit = (values: GetListDepartmentRequest) => {
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
