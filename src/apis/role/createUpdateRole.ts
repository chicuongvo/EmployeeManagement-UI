import { useMutation, useQueryClient } from "@tanstack/react-query";
import showMessage from "@/utils/showMessage";

import requestApi from "@/utils/requestApi";
import type { ROLE, CreateRoleRequest, UpdateRoleRequest } from "./model/Role";

export const createRole = async (params: CreateRoleRequest): Promise<ROLE> => {
    const response = await requestApi.post<{ data: ROLE }>("/role", params, {
        hideMessage: true,
    });
    return response.data;
};

export const updateRole = async (
    id: number,
    params: UpdateRoleRequest
): Promise<ROLE> => {
    const response = await requestApi.put<{ data: ROLE }>(`/role/${id}`, params, {
        hideMessage: true,
    });
    return response.data;
};

export const useCreateRole = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            showMessage({
                type: "toast",
                level: "success",
                title: "Tạo cấp bậc thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["getListRole"] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showMessage({
                type: "toast",
                level: "error",
                title: error?.message || "Tạo cấp bậc thất bại",
            });
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
            showMessage({
                type: "toast",
                level: "success",
                title: "Cập nhật cấp bậc thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["getListRole"] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showMessage({
                type: "toast",
                level: "error",
                title: error?.message || "Cập nhật cấp bậc thất bại",
            });
        },
    });
};

export const updateRoleLevels = async (params: { roleIds: number[] }): Promise<void> => {
    await requestApi.put("/role/levels/update", params, {
        hideMessage: true,
    });
};

export const useUpdateRoleLevels = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRoleLevels,
        onSuccess: () => {
            showMessage({
                type: "toast",
                level: "success",
                title: "Cập nhật thứ tự cấp bậc thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["getListRole"] });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showMessage({
                type: "toast",
                level: "error",
                title: error?.message || "Cập nhật thứ tự cấp bậc thất bại",
            });
        },
    });
};
