import { useContext } from "react";
import { ContractContext } from "../contexts/ContractContext";

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
