import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { UpdateRequestContext } from "./updateRequestContext";
import { getAllUpdateRequests } from "../../services/update-request";
import { mockUpdateRequests } from "../../data/mockData";
import type {
  UpdateRequestResponse,
  UpdateRequestQueryParams,
} from "../../types/UpdateRequest";

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = false;

export const UpdateRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [updateRequests, setUpdateRequests] = useState<
    UpdateRequestResponse[]
  >([]);
  const [selectedUpdateRequest, setSelectedUpdateRequest] =
    useState<UpdateRequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<UpdateRequestQueryParams>({});

  const fetchUpdateRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Filter mock data based on queryParams
        let filteredData = [...mockUpdateRequests];
        
        if (queryParams.status) {
          filteredData = filteredData.filter(
            (item) => item.status === queryParams.status
          );
        }
        
        if (queryParams.requestedById) {
          filteredData = filteredData.filter(
            (item) => item.requestedById === queryParams.requestedById
          );
        }
        
        if (queryParams.reviewedById) {
          filteredData = filteredData.filter(
            (item) => item.reviewedById === queryParams.reviewedById
          );
        }
        
        setUpdateRequests(filteredData as UpdateRequestResponse[]);
      } else {
        const data = await getAllUpdateRequests(queryParams);
        setUpdateRequests(data);
      }
    } catch (error) {
      console.error("Error fetching update requests:", error);
      setUpdateRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  const refreshUpdateRequests = useCallback(() => {
    fetchUpdateRequests();
  }, [fetchUpdateRequests]);

  useEffect(() => {
    fetchUpdateRequests();
  }, [fetchUpdateRequests]);

  return (
    <UpdateRequestContext.Provider
      value={{
        updateRequests,
        setUpdateRequests,
        selectedUpdateRequest,
        setSelectedUpdateRequest,
        isLoading,
        setIsLoading,
        queryParams,
        setQueryParams,
        refreshUpdateRequests,
      }}
    >
      {children}
    </UpdateRequestContext.Provider>
  );
};

