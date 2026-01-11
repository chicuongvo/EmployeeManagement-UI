import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  listEmployeeManagementKey?: string[];
  listEmployeeActiveKey?: string[];
  listDepartmentActiveKey?: string[];
  listPositionActiveKey?: string[];
  listProjectActiveKey?: string[];

  setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
  setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
  setListDepartmentActiveKey: (listDepartmentActiveKey?: string[]) => void;
  setListPositionActiveKey: (listPositionActiveKey?: string[]) => void;
  setListProjectActiveKey: (listProjectActiveKey?: string[]) => void;
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
      }),
      {
        name: "table_keys_store",
        partialize: ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listProjectActiveKey,
        }) => ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
          listPositionActiveKey,
          listProjectActiveKey,
        }),
      }
    ),
    { enabled: import.meta.env.MODE !== "production" }
  )
);

export default useTableStore;
