import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import requestApi from "@/utils/requestApi";
import type { ROLE, CreateRoleRequest, UpdateRoleRequest } from "./model/Role";

export const createRole = async (params: CreateRoleRequest): Promise<ROLE> => {
    const response = await requestApi.post<{ data: ROLE }>("/role", params);
    return response.data;
};

export const updateRole = async (
    id: number,
    params: UpdateRoleRequest
): Promise<ROLE> => {
    const response = await requestApi.patch<{ data: ROLE }>(`/role/${id}`, params);
    return response.data;
};

export const useCreateRole = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            message.success("Tạo cấp bậc thành công");
            queryClient.invalidateQueries({ queryKey: ["getListRole"] });
            options?.onSuccess?.();
        },
        onError: () => {
            message.error("Tạo cấp bậc thất bại");
        },
    });
};

export const useUpdateRole = (
    id: number,
    options?: { onSuccess?: () => void }
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: UpdateRoleRequest) => updateRole(id, params),
        onSuccess: () => {
            message.success("Cập nhật cấp bậc thành công");
            queryClient.invalidateQueries({ queryKey: ["getListRole"] });
            options?.onSuccess?.();
        },
        onError: () => {
            message.error("Cập nhật cấp bậc thất bại");
        },
    });
};
