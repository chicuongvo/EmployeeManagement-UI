import { useQuery } from "@tanstack/react-query";
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
import useTableStore from "@/stores/tableStore";

import { getAllUpdateRequests } from "@/api/update-request.api";
import type {
  UpdateRequestResponse,
  UpdateRequestQueryParams,
} from "@/types/UpdateRequest";
import {
  createUpdateRequest,
  updateUpdateRequest,
  deleteUpdateRequest,
  reviewRequest,
} from "@/services/update-request";
import { toast } from "react-toastify";

interface GetListUpdateRequestResponse {
  data: UpdateRequestResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UpdateRequestContextType {
  params: UpdateRequestQueryParams;
  paramsStr: string;
  setPopupUpdateRequest: React.Dispatch<React.SetStateAction<boolean>>;
  popupUpdateRequest: boolean;
  refetch: () => void;
  dataResponse?: GetListUpdateRequestResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: UpdateRequestQueryParams) => void;
  setSelectedUpdateRequest: React.Dispatch<
    React.SetStateAction<UpdateRequestResponse | null>
  >;
  selectedUpdateRequest: UpdateRequestResponse | null;
  handleCreate: (
    data: Parameters<typeof createUpdateRequest>[0]
  ) => Promise<void>;
  handleUpdate: (
    id: number,
    data: Parameters<typeof updateUpdateRequest>[1]
  ) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleReview: (
    id: number,
    status: "APPROVED" | "NOT_APPROVED"
  ) => Promise<void>;
  tab?: string;
}

const UpdateRequestContext = createContext<
  UpdateRequestContextType | undefined
>(undefined);

export const UpdateRequestProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [_, setSearchParams] = useSearchParams();
  const { listUpdateRequestActiveKey } = useTableStore((state) => state);
  const [popupUpdateRequest, setPopupUpdateRequest] = useState(false);
  const [selectedUpdateRequest, setSelectedUpdateRequest] =
    useState<UpdateRequestResponse | null>(null);

  const status = useGetParam<string>("status", "string");
  const requestedById = useGetParam<number>("requestedById", "number");
  const reviewedById = useGetParam<number>("reviewedById", "number");
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const content = useGetParam<string>("content", "string");
  const createdDateFrom = useGetParam<string>("created_date_from", "string");
  const createdDateTo = useGetParam<string>("created_date_to", "string");
  const updatedDateFrom = useGetParam<string>("updated_date_from", "string");
  const updatedDateTo = useGetParam<string>("updated_date_to", "string");
  const tab = useGetParam<string>("tab");

  const params = useMemo((): UpdateRequestQueryParams => {
    return {
      status: status as "PENDING" | "APPROVED" | "NOT_APPROVED" | undefined,
      requestedById,
      reviewedById,
      page,
      limit,
      sort,
      content,
      created_date_from: createdDateFrom,
      created_date_to: createdDateTo,
      updated_date_from: updatedDateFrom,
      updated_date_to: updatedDateTo,
    };
  }, [
    status,
    requestedById,
    reviewedById,
    page,
    limit,
    sort,
    content,
    createdDateFrom,
    createdDateTo,
    updatedDateFrom,
    updatedDateTo,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["update-requests", params, tab],
    queryFn: async (): Promise<GetListUpdateRequestResponse> => {
      const response = await getAllUpdateRequests(params);
      return response as GetListUpdateRequestResponse;
    },
    enabled: !!tab,
  });

  const handleFilterSubmit = (values: UpdateRequestQueryParams) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          tab: tab ?? 1,
        },
        { arrayFormat: "comma" }
      )
    );
  };

  const handleCreate = async (
    data: Parameters<typeof createUpdateRequest>[0]
  ) => {
    try {
      await createUpdateRequest(data);
      toast.success("Gửi đơn xin thành công");
      refetch();
    } catch (error) {
      toast.error("Gửi đơn xin thất bại");
      console.error(error);
      throw error;
    }
  };

  const handleUpdate = async (
    id: number,
    data: Parameters<typeof updateUpdateRequest>[1]
  ) => {
    try {
      await updateUpdateRequest(id, data);
      toast.success("Cập nhật đơn xin thành công");
      refetch();
    } catch (error) {
      toast.error("Cập nhật đơn xin thất bại");
      console.error(error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUpdateRequest(id);
      toast.success("Xóa yêu cầu thành công");
      refetch();
    } catch (error) {
      toast.error("Xóa yêu cầu thất bại");
      console.error(error);
      throw error;
    }
  };

  const handleReview = async (
    id: number,
    status: "APPROVED" | "NOT_APPROVED"
  ) => {
    try {
      await reviewRequest(id, { status });
      toast.success(
        `Yêu cầu đã được ${status === "APPROVED" ? "phê duyệt" : "từ chối"}`
      );
      refetch();
    } catch (error) {
      toast.error("Xử lý yêu cầu thất bại");
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams(
        queryString.stringify({
          tab: 1,
          page: 1,
          limit: 10,
        })
      );
    }
  }, [setSearchParams, tab]);

  return (
    <UpdateRequestContext.Provider
      value={{
        params,
        paramsStr,
        setPopupUpdateRequest,
        popupUpdateRequest,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedUpdateRequest,
        selectedUpdateRequest,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleReview,
        tab,
      }}
    >
      {children}
    </UpdateRequestContext.Provider>
  );
};

export const useUpdateRequestContext = () => {
  const context = useContext(UpdateRequestContext);
  if (!context) {
    throw new Error(
      "useUpdateRequestContext must be used within an UpdateRequestProvider"
    );
  }
  return context;
};
