/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import { getDepartment } from "@/apis/department/getDepartment";
import type { DEPARTMENT } from "@/apis/department/model/Department";
import { useUser } from "@/hooks/useUser";

interface DepartmentDetailContextType {
    department: DEPARTMENT | undefined;
    refetchDepartment: () => void;
    isLoadingDepartment: boolean;
    editMode: boolean;
    isEditable: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DepartmentDetailContext = createContext<
    DepartmentDetailContextType | undefined
>(undefined);

export const DepartmentDetailProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const params = useParams();
    const location = useLocation();
    const pathname = location.pathname;
    const { userProfile } = useUser();
    const [editMode, setEditMode] = useState(false);

    // Determine department ID: use user's departmentId if route is /me, otherwise use params.id
    const departmentId = useMemo(() => {
        if (pathname.includes("/me")) {
            return userProfile?.department?.id || 0;
        }
        return Number(params.id) || 0;
    }, [pathname, params.id, userProfile?.department?.id]);

    const {
        isLoading: isLoadingDepartment,
        data: departmentData,
        refetch: refetchDepartment,
    } = useQuery({
        queryFn: (): Promise<DEPARTMENT> => {
            return getDepartment(departmentId);
        },
        queryKey: ["department-detail", departmentId],
        enabled: !!departmentId,
    });

    const isEditable = useMemo(() => editMode, [editMode]);

    const contextValue = useMemo(
        () => ({
            department: departmentData || undefined,
            refetchDepartment,
            isLoadingDepartment,
            editMode,
            isEditable,
            setEditMode,
        }),
        [departmentData, refetchDepartment, isLoadingDepartment, editMode, isEditable]
    );

    return (
        <DepartmentDetailContext.Provider value={contextValue}>
            {children}
        </DepartmentDetailContext.Provider>
    );
};

export const useDepartmentDetailContext = () => {
    const context = useContext(DepartmentDetailContext);
    if (context === undefined) {
        throw new Error(
            "useDepartmentDetailContext must be used within a DepartmentDetailProvider"
        );
    }
    return context;
};
