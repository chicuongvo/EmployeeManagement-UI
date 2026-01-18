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
import type { POSITION } from "@/apis/position/model/Position";
import { getListRole, type GetListRoleRequest, type GetListRoleResponse, type ROLE } from "@/apis/role";

export type ModalMode =
  | "CREATE_DEPARTMENT"
  | "UPDATE_DEPARTMENT"
  | "CREATE_POSITION"
  | "UPDATE_POSITION"
  | "CREATE_ROLE"
  | "UPDATE_ROLE";

interface DepartmentContextType {
  params: GetListDepartmentRequest;
  paramsStr: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalMode: ModalMode;
  setModalMode: React.Dispatch<React.SetStateAction<ModalMode>>;
  refetch: () => void;
  dataResponse?: GetListDepartmentResponse | GetListPositionResponse | GetListRoleResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (
    values: GetListDepartmentRequest | GetListPositionRequest
  ) => void;
  setSelectedDepartment: (dept: DEPARTMENT | null) => void;
  selectedDepartment: DEPARTMENT | null;
  setSelectedPosition: (pos: POSITION | null) => void;
  selectedPosition: POSITION | null;
  setSelectedRole: (role: ROLE | null) => void;
  selectedRole: ROLE | null;
  openCreateModal: () => void;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("CREATE_DEPARTMENT");
  const [selectedDepartment, _setSelectedDepartment] =
    useState<DEPARTMENT | null>(null);
  const [selectedPosition, _setSelectedPosition] = useState<POSITION | null>(
    null
  );
  const [selectedRole, _setSelectedRole] = useState<ROLE | null>(null);

  const setSelectedDepartment = (dept: DEPARTMENT | null) => {
    _setSelectedDepartment(dept);
    if (dept) {
      setModalMode("UPDATE_DEPARTMENT");
      setIsModalOpen(true);
    }
  };

  const setSelectedPosition = (pos: POSITION | null) => {
    _setSelectedPosition(pos);
    if (pos) {
      setModalMode("UPDATE_POSITION");
      setIsModalOpen(true);
    }
  };

  const setSelectedRole = (role: ROLE | null) => {
    _setSelectedRole(role);
    if (role) {
      setModalMode("UPDATE_ROLE");
      setIsModalOpen(true);
    }
  };

  const openCreateModal = () => {
    if (tab === TABS.DEPARTMENT) {
      setModalMode("CREATE_DEPARTMENT");
    } else if (tab === TABS.POSITION) {
      setModalMode("CREATE_POSITION");
    } else {
      setModalMode("CREATE_ROLE");
    }
    _setSelectedDepartment(null);
    _setSelectedPosition(null);
    _setSelectedRole(null);
    setIsModalOpen(true);
  };

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
  const departmentId = useGetParam<number>("departmentId", "number");
  const roleId = useGetParam<number>("roleId", "number");

  const params = useMemo((): GetListDepartmentRequest | GetListPositionRequest | GetListRoleRequest => {
    return {
      name,
      departmentCode,
      description,
      managerId,
      page,
      limit,
      sort,
      // Support both naming conventions for backward compatibility
      departmentId,
      roleId,
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
    departmentId,
    roleId
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["departments", params, tab],
    queryFn: (): Promise<
      GetListDepartmentResponse | GetListPositionResponse | GetListRoleResponse
    > => {
      const modifiedParams = {
        ...params,
        [`${params.general_code_type ?? ""}`]: params.general_code
          ? params.general_code.trim()
          : undefined,
      };

      modifiedParams.general_code = undefined;
      modifiedParams.general_code_type = undefined;

      if (tab === TABS.DEPARTMENT) {
        return getListDepartment(modifiedParams);
      } else if (tab === TABS.POSITION) {
        return getListPosition(modifiedParams);
      } else {
        const roleParams = {
          ...modifiedParams,
          name: Array.isArray(modifiedParams.name)
            ? modifiedParams.name[0]
            : modifiedParams.name,
        };
        return getListRole(roleParams);
      }
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
        isModalOpen,
        setIsModalOpen,
        modalMode,
        setModalMode,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedDepartment,
        selectedDepartment,
        setSelectedPosition,
        selectedPosition,
        setSelectedRole,
        selectedRole,
        openCreateModal,
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
