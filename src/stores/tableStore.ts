import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  listEmployeeManagementKey?: string[];
  listEmployeeActiveKey?: string[];
  listDepartmentActiveKey?: string[];
  listPositionActiveKey?: string[];
  listProjectActiveKey?: string[];
  listPerformanceDetailActiveKey?: string[];
  listContractActiveKey?: string[];
  listUpdateRequestActiveKey?: string[];
  listMeetingActiveKey?: string[];

  setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
  setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
  setListDepartmentActiveKey: (listDepartmentActiveKey?: string[]) => void;
  setListPositionActiveKey: (listPositionActiveKey?: string[]) => void;
  setListProjectActiveKey: (listProjectActiveKey?: string[]) => void;
  setListPerformanceDetailActiveKey: (listPerformanceDetailActiveKey?: string[]) => void;
  setListContractActiveKey: (listContractActiveKey?: string[]) => void;
  setListUpdateRequestActiveKey: (listUpdateRequestActiveKey?: string[]) => void;
  setListMeetingActiveKey: (listMeetingActiveKey?: string[]) => void;
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
      }),
      {
        name: "table_keys_store",
        partialize: ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listProjectActiveKey,
          listPerformanceDetailActiveKey
          listContractActiveKey,
          listUpdateRequestActiveKey,
          listMeetingActiveKey,
        }) => ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listProjectActiveKey,
          listPerformanceDetailActiveKey
          listContractActiveKey,
          listUpdateRequestActiveKey,
          listMeetingActiveKey,
        }),
      }
    ),
    { enabled: import.meta.env.MODE !== "production" }
  )
);

export default useTableStore;
