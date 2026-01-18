import { axiosClient } from "../lib/axios";
import type { UserResponse } from "../types/User";

export const getProfile = async (): Promise<UserResponse> => {
  const response = await axiosClient.get("/auth/me");
  return response.data.data;
};

