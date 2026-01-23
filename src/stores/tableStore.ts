import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  listEmployeeManagementKey?: string[];
  listEmployeeActiveKey?: string[];
  listDepartmentActiveKey?: string[];
  listPositionActiveKey?: string[];
  listRoleActiveKey?: string[];
  listProjectActiveKey?: string[];
  listPerformanceDetailActiveKey?: string[];
  listPerformanceByDepartmentActiveKey?: string[];
  listPerformanceByEmployeeActiveKey?: string[];
  listContractActiveKey?: string[];
  listUpdateRequestActiveKey?: string[];
  listMeetingActiveKey?: string[];
  listMyPerformanceActiveKey?: string[];

  setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
  setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
  setListDepartmentActiveKey: (listDepartmentActiveKey?: string[]) => void;
  setListPositionActiveKey: (listPositionActiveKey?: string[]) => void;
  setListRoleActiveKey: (listRoleActiveKey?: string[]) => void;
  setListProjectActiveKey: (listProjectActiveKey?: string[]) => void;
  setListPerformanceDetailActiveKey: (
    listPerformanceDetailActiveKey?: string[],
  ) => void;
  setListPerformanceByDepartmentActiveKey: (
    listPerformanceByDepartmentActiveKey?: string[],
  ) => void;
  setListPerformanceByEmployeeActiveKey: (
    listPerformanceByEmployeeActiveKey?: string[],
  ) => void;
  setListContractActiveKey: (listContractActiveKey?: string[]) => void;
  setListUpdateRequestActiveKey: (
    listUpdateRequestActiveKey?: string[],
  ) => void;
  setListMeetingActiveKey: (listMeetingActiveKey?: string[]) => void;
  setListMyPerformanceActiveKey: (listMyPerformanceActiveKey?: string[]) => void;
}

const useTableStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        setListEmployeeManagementKey: (listEmployeeManagementKey) => {
          set({
            listEmployeeManagementKey,
          });
        },
        setListEmployeeActiveKey: (listEmployeeActiveKey) => {
          set({
            listEmployeeActiveKey,
          });
        },
        setListDepartmentActiveKey: (listDepartmentActiveKey) => {
          set({
            listDepartmentActiveKey,
          });
        },
        setListPositionActiveKey: (listPositionActiveKey) => {
          set({
            listPositionActiveKey,
          });
        },
        setListRoleActiveKey: (listRoleActiveKey) => {
          set({
            listRoleActiveKey,
          });
        },
        setListProjectActiveKey: (listProjectActiveKey) => {
          set({
            listProjectActiveKey,
          });
        },
        setListPerformanceDetailActiveKey: (listPerformanceDetailActiveKey) => {
          set({
            listPerformanceDetailActiveKey,
          });
        },
        setListPerformanceByDepartmentActiveKey: (listPerformanceByDepartmentActiveKey) => {
          set({
            listPerformanceByDepartmentActiveKey,
          });
        },
        setListPerformanceByEmployeeActiveKey: (listPerformanceByEmployeeActiveKey) => {
          set({
            listPerformanceByEmployeeActiveKey,
          });
        },
        setListContractActiveKey: (listContractActiveKey) => {
          set({
            listContractActiveKey,
          });
        },
        setListUpdateRequestActiveKey: (listUpdateRequestActiveKey) => {
          set({
            listUpdateRequestActiveKey,
          });
        },
        setListMeetingActiveKey: (listMeetingActiveKey) => {
          set({
            listMeetingActiveKey,
          });
        },
        setListMyPerformanceActiveKey: (listMyPerformanceActiveKey) => {
          set({
            listMyPerformanceActiveKey,
          });
        },
      }),
      {
        name: "table_keys_store",
        partialize: ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listRoleActiveKey,
          listProjectActiveKey,
          listPerformanceDetailActiveKey,
          listPerformanceByDepartmentActiveKey,
          listPerformanceByEmployeeActiveKey,
          listContractActiveKey,
          listUpdateRequestActiveKey,
          listMeetingActiveKey,
          listMyPerformanceActiveKey,
        }) => ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listRoleActiveKey,
          listProjectActiveKey,
          listPerformanceDetailActiveKey,
          listPerformanceByDepartmentActiveKey,
          listPerformanceByEmployeeActiveKey,
          listContractActiveKey,
          listUpdateRequestActiveKey,
          listMeetingActiveKey,
          listMyPerformanceActiveKey,
        }),
      },
    ),
    { enabled: import.meta.env.MODE !== "production" },
  ),
);

export default useTableStore;
