import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  listEmployeeManagementKey?: string[];
  listEmployeeActiveKey?: string[];
  listDepartmentActiveKey?: string[];

  setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
  setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
  setListDepartmentActiveKey: (listDepartmentActiveKey?: string[]) => void;
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
      }),
      {
        name: "table_keys_store",
        partialize: ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
        }) => ({
          listEmployeeManagementKey,
          listEmployeeActiveKey,
          listDepartmentActiveKey,
        }),
      }
    ),
    { enabled: import.meta.env.MODE !== "production" }
  )
);

export default useTableStore;
