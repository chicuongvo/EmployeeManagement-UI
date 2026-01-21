import { useQuery } from "@tanstack/react-query";
import { getWorkHistoryList } from ".";
import type { GetWorkHistoryListRequest } from "./model/WorkHistory";

export const useGetWorkHistoryList = (params: GetWorkHistoryListRequest) => {
    return useQuery({
        queryKey: ["workHistory", "list", params],
        queryFn: () => getWorkHistoryList(params),
        enabled: !!params.employeeId, // Only fetch if employeeId is provided
    });
};
