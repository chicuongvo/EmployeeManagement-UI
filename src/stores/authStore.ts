import type { EMPLOYEE } from "@/apis/employee/model/Employee";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  is_verified: boolean;
  is_authenticated: boolean;
  permissions?: string[];
  token?: string;
  user?: EMPLOYEE;
  ip?: string;
  setLoginSuccess: (
    user: EMPLOYEE,
    token: string,
    permissions?: string[],
  ) => void;
  setVerifySuccess: (permissions?: string[], ip?: string) => void;
  setLogoutSuccess: () => void;
  setIsVerified: (is_verified: boolean) => void;
  setIsAuthenticated: (is_authenticated: boolean) => void;
  setToken: (token?: string) => void;
  setUser: (user?: EMPLOYEE) => void;
  setPermissions: (permissions?: string[]) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        is_verified: false,
        is_authenticated: false,
        setLoginSuccess: (user, token, permissions) => {
          set({
            user,
            token,
            permissions,
          });
        },
        setVerifySuccess: (permissions, ip) => {
          set({
            is_verified: true,
            is_authenticated: true,
            permissions,
            ip,
          });
        },
        setLogoutSuccess: () => {
          set({
            token: undefined,
            user: undefined,
            permissions: undefined,
            ip: undefined,
          });
        },
        setIsVerified: (is_verified) => {
          set({
            is_verified,
          });
        },
        setIsAuthenticated: (is_authenticated) => {
          set({
            is_authenticated,
          });
        },
        setToken: (token) => {
          set({
            token,
          });
        },
        setUser: (user) => {
          set({
            user,
          });
        },
        setPermissions: (permissions) => {
          set({
            permissions,
          });
        },
      }),
      {
        name: "auth_store",
        partialize: ({ token, user, permissions }) => ({
          token,
          user,
          permissions,
        }),
      },
    ),
    { enabled: import.meta.env.MODE !== "production" },
  ),
);

export default useAuthStore;
