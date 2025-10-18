import { axiosClient, axiosClientFormData } from "../lib/axios";
import type {
  UserResponse,
  SignInData,
  CreateUserRequest,
} from "../types/User";

export const signIn = async (
  signInData: SignInData
): Promise<Partial<UserResponse>> => {
  const response = await axiosClient.post("/auth/login", signInData);

  return response.data.data;
};

export const signUp = async (
  signUpData: Partial<CreateUserRequest>
): Promise<UserResponse> => {
  const response = await axiosClient.post("/auth/register", signUpData);

  return response.data.data;
};

export const signOut = async (): Promise<string> => {
  const response = await axiosClient.post("/auth/signout");

  return response.data.message;
};

// Send reset password code
export const sendResetCode = async (email: string): Promise<string> => {
  const response = await axiosClient.post("/auth/send-reset-code", { email });
  return response.data;
};

// Reset password with code
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<string> => {
  const response = await axiosClient.post("/auth/reset-password", {
    email,
    code,
    newPassword,
  });
  return response.data;
};

// Get all users
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosClient.get("/users");
  return response.data.data;
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await axiosClient.get(`/users/${id}`);
  return response.data.data;
};

export const getProfile = async (): Promise<UserResponse> => {
  const response = await axiosClient.get("/auth/me");
  return response.data.data;
};
// Update user
export const updateUser = async (id: number, formData: FormData) => {
  const response = await axiosClientFormData.put(`/users/${id}`, formData);
  return response.data.data;
};

// Delete user
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data.message;
};
