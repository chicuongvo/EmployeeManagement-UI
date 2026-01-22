import { axiosClient } from "@/lib/axios";

const endpoints = {
    changePassword: "/auth/change-password",
};

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    code: string;
    message: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await axiosClient.post<ChangePasswordResponse>(
        endpoints.changePassword,
        data
    );
    return response.data;
};
