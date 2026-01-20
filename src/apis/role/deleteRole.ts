import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

import requestApi from "@/utils/requestApi";

export const deleteRole = async (id: number): Promise<void> => {
    await requestApi.delete(`/role/${id}`);
};

export const useDeleteRole = (options?: { onSuccess?: () => void }) => {
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            message.success("Xóa cấp bậc thành công");
            options?.onSuccess?.();
        },
        onError: () => {
            message.error("Xóa cấp bậc thất bại");
        },
    });
};
