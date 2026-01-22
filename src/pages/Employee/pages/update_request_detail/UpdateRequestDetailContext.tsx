/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { getUpdateRequestById } from "@/services/update-request";
import type { UpdateRequestResponse } from "@/types/UpdateRequest";

interface UpdateRequestDetailContextType {
  updateRequest: UpdateRequestResponse | undefined;
  isCreate: boolean;
  editMode: boolean;
  isEditable: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  refetchUpdateRequest: () => void;
  isLoadingUpdateRequest: boolean;
}

const UpdateRequestDetailContext = createContext<
  UpdateRequestDetailContextType | undefined
>(undefined);

export const UpdateRequestDetailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const [editMode, setEditMode] = useState(false);

  const {
    isLoading: isLoadingUpdateRequest,
    data: updateRequestDetailData,
    refetch: refetchUpdateRequest,
  } = useQuery({
    queryFn: async (): Promise<UpdateRequestResponse> => {
      return getUpdateRequestById(Number(params.id) || 0);
    },
    queryKey: ["update-request-detail", Number(params.id)],
    enabled: !!Number(params.id),
  });

  const isCreate = useMemo(() => pathname.includes("add-new"), [pathname]);

  const isEditable = useMemo(() => {
    if (isCreate) return true;
    if (editMode && updateRequestDetailData?.status === "PENDING") return true;
    return false;
  }, [editMode, isCreate, updateRequestDetailData?.status]);

  const contextValue = useMemo(
    () => ({
      updateRequest: updateRequestDetailData || undefined,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchUpdateRequest,
      isLoadingUpdateRequest,
    }),
    [
      updateRequestDetailData,
      isCreate,
      editMode,
      isEditable,
      setEditMode,
      refetchUpdateRequest,
      isLoadingUpdateRequest,
    ],
  );

  return (
    <UpdateRequestDetailContext.Provider value={contextValue}>
      {children}
    </UpdateRequestDetailContext.Provider>
  );
};

export const useUpdateRequestDetailContext = () => {
  const context = useContext(UpdateRequestDetailContext);
  if (context === undefined) {
    throw new Error(
      "useUpdateRequestDetailContext must be used within a UpdateRequestDetailProvider",
    );
  }
  return context;
};
