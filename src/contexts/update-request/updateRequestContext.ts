import { createContext } from "react";
import type {
  UpdateRequestResponse,
  UpdateRequestQueryParams,
} from "../../types/UpdateRequest";

export interface UpdateRequestContextType {
  updateRequests: UpdateRequestResponse[];
  setUpdateRequests: React.Dispatch<
    React.SetStateAction<UpdateRequestResponse[]>
  >;
  selectedUpdateRequest: UpdateRequestResponse | null;
  setSelectedUpdateRequest: React.Dispatch<
    React.SetStateAction<UpdateRequestResponse | null>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  queryParams: UpdateRequestQueryParams;
  setQueryParams: React.Dispatch<
    React.SetStateAction<UpdateRequestQueryParams>
  >;
  refreshUpdateRequests: () => void;
}

export const UpdateRequestContext = createContext<UpdateRequestContextType | null>(
  null
);

