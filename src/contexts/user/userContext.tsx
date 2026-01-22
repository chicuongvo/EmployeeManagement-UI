import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./userContext";
import { getProfile } from "../../api/user.api";
import type { UserResponse } from "../../types/User";
import { useRoleLevelSettings } from "../../hooks/useRoleLevelSettings";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [userChanged, setUserChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize role level settings
  useRoleLevelSettings();

  // Calculate roleLevel from userProfile
  const roleLevel = userProfile?.position?.role?.level ?? null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();

        if (response) {
          setUserProfile(response);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setUserChanged(false);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userChanged]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userChanged,
        setUserChanged,
        isLoading,
        roleLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
