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
  title?: string;
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

  const isRead = useGetParam<boolean>("isRead", "boolean");
  const title = useGetParam<string>("title", "string");
  const creatorName = useGetParam<string>("creatorName", "string");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  // API params - không bao gồm title (tìm kiếm local)
  // Fetch với limit lớn để có đủ data cho local search
  const apiParams = useMemo(() => {
    return {
      isRead,
      page: 1,
      limit: 100, // Fetch large amount for local search
    };
  }, [isRead]);

  const apiParamsStr = useMemo(() => {
    return queryString.stringify(apiParams);
  }, [apiParams]);

  // Fetch data from API (without title filter, with large limit)
  const {
    data: allDataResponse,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["notifications", "list", apiParamsStr],
    queryFn: () => getListNotification(apiParams),
  });

  // Filter data locally based on title search
  const filteredNotifications = useMemo(() => {
    if (!allDataResponse?.data.notifications) return [];
    
    let filtered = allDataResponse.data.notifications;

    // Filter by title (local search)
    if (title && title.trim()) {
      const searchTerm = title.toLowerCase().trim();
      filtered = filtered.filter((notification) =>
        notification.title.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by creatorName (local search)
    if (creatorName && creatorName.trim()) {
      const searchTerm = creatorName.toLowerCase().trim();
      filtered = filtered.filter((notification) =>
        notification.creatorName?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [allDataResponse?.data.notifications, title, creatorName]);

  // Paginate filtered results
  const paginatedNotifications = useMemo(() => {
    const currentPage = page || 1;
    const pageSize = limit || 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredNotifications.slice(startIndex, endIndex);
  }, [filteredNotifications, page, limit]);

  // Create response with filtered and paginated data
  const dataResponse = useMemo(() => {
    if (!allDataResponse) return undefined;

    const currentPage = page || 1;
    const pageSize = limit || 10;
    const total = filteredNotifications.length;

    return {
      ...allDataResponse,
      data: {
        ...allDataResponse.data,
        notifications: paginatedNotifications,
        pagination: {
          total,
          page: currentPage,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }, [allDataResponse, paginatedNotifications, filteredNotifications, page, limit]);

  const params = useMemo((): GetListNotificationRequest => {
    return {
      isRead,
      title,
      creatorName,
      page,
      limit: limit || 10,
    };
  }, [isRead, title, creatorName, page, limit]);

  const paramsStr = useMemo(() => {
    return queryString.stringify({
      ...params,
      sort,
    });
  }, [params, sort]);

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
      limit: values.limit || 10,
      tab: tab ?? "1",
    };
    setSearchParams(
      queryString.stringify(newParams, { arrayFormat: "comma" }),
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
