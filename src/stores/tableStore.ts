import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
    listEmployeeManagementKey?: string[];
    listEmployeeActiveKey?: string[];

    setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
    setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
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
            }),
            {
                name: "table_keys_store",
                partialize: ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey
                }) => ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey
                }),
            }
        ),
        { enabled: import.meta.env.MODE !== "production" }
    )
);

export default useTableStore;
