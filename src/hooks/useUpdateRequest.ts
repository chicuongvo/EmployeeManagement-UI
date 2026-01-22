import { useContext } from "react";
import { UpdateRequestContext } from "../pages/Management/pages/update-request/UpdateRequestContext";

export const useUpdateRequest = () => {
  const context = useContext(UpdateRequestContext);
  if (!context) {
    throw new Error(
      "useUpdateRequest must be used within an UpdateRequestProvider",
    );
  }
  return context;
};
