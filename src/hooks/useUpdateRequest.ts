import { useContext } from "react";
import { UpdateRequestContext } from "../contexts/update-request/updateRequestContext";

export const useUpdateRequest = () => {
  const context = useContext(UpdateRequestContext);
  if (!context) {
    throw new Error("useUpdateRequest must be used within an UpdateRequestProvider");
  }
  return context;
};

