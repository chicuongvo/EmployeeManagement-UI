import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
    listEmployeeManagementKey?: string[];
    listEmployeeActiveKey?: string[];
    performanceDetailActiveKey?: string[];

    setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
    setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
    setPerformanceDetailActiveKey: (performanceDetailActiveKey?: string[]) => void;
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
                setPerformanceDetailActiveKey: (performanceDetailActiveKey) => {
                    set({
                        performanceDetailActiveKey,
                    });
                },
            }),
            {
                name: "table_keys_store",
                partialize: ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey,
                    performanceDetailActiveKey
                }) => ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey,
                    performanceDetailActiveKey
                }),
            }
        ),
        { enabled: import.meta.env.MODE !== "production" }
    )
);

export default useTableStore;
