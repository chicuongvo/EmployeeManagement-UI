import requestApi from "@/utils/requestApi";
import type {
    GetListRoleRequest,
    GetListRoleResponse,
} from "./model/Role";

const endpoints = {
    role: "/role",
};

const getList =
    (url: string) =>
        async (params: GetListRoleRequest): Promise<GetListRoleResponse> =>
            requestApi.get<GetListRoleResponse>(url, params);

export const getListRole = getList(endpoints.role);
