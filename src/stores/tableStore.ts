import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
    listEmployeeManagementKey?: string[];
    listEmployeeActiveKey?: string[];
    listUpdateRequestActiveKey?: string[];
    listContractActiveKey?: string[];

    setListEmployeeManagementKey: (listEmployeeManagementKey?: string[]) => void;
    setListEmployeeActiveKey: (listEmployeeActiveKey?: string[]) => void;
    setListUpdateRequestActiveKey: (listUpdateRequestActiveKey?: string[]) => void;
    setListContractActiveKey: (listContractActiveKey?: string[]) => void;
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
                setListUpdateRequestActiveKey: (listUpdateRequestActiveKey) => {
                    set({
                        listUpdateRequestActiveKey,
                    });
                },
                setListContractActiveKey: (listContractActiveKey) => {
                    set({
                        listContractActiveKey,
                    });
                },
            }),
            {
                name: "table_keys_store",
                partialize: ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey,
                    listUpdateRequestActiveKey,
                    listContractActiveKey,
                }) => ({
                    listEmployeeManagementKey,
                    listEmployeeActiveKey,
                    listUpdateRequestActiveKey,
                    listContractActiveKey,
                }),
            }
        ),
        { enabled: import.meta.env.MODE !== "production" }
    )
);

export default useTableStore;
