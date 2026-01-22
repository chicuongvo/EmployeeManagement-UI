import { createContext } from "react";
import type { UserResponse } from "../../types/User";

export interface UserContextType {
  userProfile: UserResponse | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserResponse | null>>;
  userChanged: boolean;
  setUserChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  roleLevel: number | null;
}

export const UserContext = createContext<UserContextType | null>(null);
