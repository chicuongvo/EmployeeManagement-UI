import { axiosClient } from "@/lib/axios";

const endpoints = {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
};

export interface SignInRequest {
    employeeCode: string;
    password: string;
}

export interface SignInResponse {
    code: string;
    message: string;
    data: string; // employeeCode
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await axiosClient.post<SignInResponse>(endpoints.signIn, data);
    return response.data;
};

export const signOut = async (): Promise<void> => {
    await axiosClient.post(endpoints.signOut, {});
};

