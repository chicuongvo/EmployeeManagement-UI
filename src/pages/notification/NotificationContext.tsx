import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import {
  getListNotification,
  createNotification,
  updateNotification,
  deleteNotification,
} from "@/apis/notification";
import type {
  CreateNotificationRequest,
  UpdateNotificationRequest,
} from "@/apis/notification";
import type {
  Notification,
  NotificationListResponse,
} from "@/apis/notification/model/Notification";

export interface GetListNotificationRequest {
  page?: number;
  limit?: number;
  isRead?: boolean;
  search?: string;
  creatorName?: string;
}

interface NotificationContextType {
  params: GetListNotificationRequest;
  paramsStr: string;
  setPopupCreateNotification: React.Dispatch<React.SetStateAction<boolean>>;
  popupCreateNotification: boolean;
  setPopupUpdateNotification: React.Dispatch<React.SetStateAction<boolean>>;
  popupUpdateNotification: boolean;
  refetch: () => void;
  dataResponse?: NotificationListResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListNotificationRequest) => void;
  setSelectedNotification: React.Dispatch<
    React.SetStateAction<Notification | null>
  >;
  selectedNotification: Notification | null;
  createNotificationMutation: ReturnType<
    typeof useMutation<
      NotificationListResponse,
      Error,
      CreateNotificationRequest,
      unknown
    >
  >;
  updateNotificationMutation: ReturnType<
    typeof useMutation<
      NotificationListResponse,
      Error,
      { id: number; data: UpdateNotificationRequest },
      unknown
    >
  >;
  deleteNotificationMutation: ReturnType<
    typeof useMutation<NotificationListResponse, Error, number, unknown>
  >;
  tab?: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [popupCreateNotification, setPopupCreateNotification] = useState(false);
  const [popupUpdateNotification, setPopupUpdateNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const isRead = useGetParam<boolean>("isRead");
  const search = useGetParam<string>("search", "string");
  const creatorName = useGetParam<string>("creatorName", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  const params = useMemo((): GetListNotificationRequest => {
    return {
      isRead,
      search,
      creatorName,
      page,
      limit: limit || 10,
    };
  }, [isRead, search, creatorName, page, limit]);

  const paramsStr = useMemo(() => {
    return queryString.stringify({
      ...params,
      sort,
    });
  }, [params, sort]);

  const {
    data: dataResponse,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["notifications", "list", paramsStr],
    queryFn: () => getListNotification(params),
  });

  const createNotificationMutation = useMutation({
    mutationFn: (data: CreateNotificationRequest) => createNotification(data),
    onSuccess: () => {
      refetch();
      setPopupCreateNotification(false);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateNotificationRequest;
    }) => updateNotification(id, data),
    onSuccess: () => {
      refetch();
      setPopupUpdateNotification(false);
      setSelectedNotification(null);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleFilterSubmit = (values: GetListNotificationRequest) => {
    const newParams = {
      ...values,
      page: 1,
    };
    setSearchParams(
      queryString.stringify({
        ...newParams,
        limit: newParams.limit || 10,
      }),
    );
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams(
        queryString.stringify({
          tab: "1",
          page: 1,
          limit: 10,
        }),
      );
    }
  }, [setSearchParams, tab]);

  const value: NotificationContextType = {
    params,
    paramsStr,
    setPopupCreateNotification,
    popupCreateNotification,
    setPopupUpdateNotification,
    popupUpdateNotification,
    refetch,
    dataResponse,
    isLoading,
    isSuccess,
    handleFilterSubmit,
    setSelectedNotification,
    selectedNotification,
    createNotificationMutation,
    updateNotificationMutation,
    deleteNotificationMutation,
    tab,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
};
