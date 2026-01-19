import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";

import useGetParam from "@/hooks/useGetParam";
import { getAttendanceReport } from "@/apis/attendance/getAttendanceReport";
import type {
    GetAttendanceReportRequest,
    GetAttendanceReportResponse,
} from "@/apis/attendance/model/Attendance";
import {
    getListLeaveApplication,
} from "@/apis/leave-application";
import type {
    GetListLeaveApplicationRequest,
    GetListLeaveApplicationResponse,
} from "@/apis/leave-application";

interface AttendanceContextType {
    params: GetAttendanceReportRequest | GetListLeaveApplicationRequest;
    paramsStr: string;
    refetch: () => void;
    dataResponse?: GetAttendanceReportResponse | GetListLeaveApplicationResponse;
    isLoading: boolean;
    isSuccess: boolean;
    handleFilterSubmit: (values: GetAttendanceReportRequest | GetListLeaveApplicationRequest) => void;
    tab?: string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
    undefined
);

export const AttendanceProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [, setSearchParams] = useSearchParams();

    const month = useGetParam<number>("month", "number", new Date().getMonth() + 1);
    const year = useGetParam<number>("year", "number", new Date().getFullYear());
    const tab = useGetParam<string>("tab");

    // Leave application params
    const status = useGetParam<string>("status", "string");
    const employeeId = useGetParam<number>("employeeId", "number");
    const leaveTypeId = useGetParam<number>("leaveTypeId", "number");
    const startDate = useGetParam<string>("startDate", "string");
    const endDate = useGetParam<string>("endDate", "string");
    const page = useGetParam<number>("page", "number");
    const limit = useGetParam<number>("limit", "number");
    const sort = useGetParam<string>("sort", "string");

    const params = useMemo((): GetAttendanceReportRequest | GetListLeaveApplicationRequest => {
        if (tab === "2") {
            // Leave application params
            return {
                status: status as any,
                employeeId,
                leaveTypeId,
                startDate,
                endDate,
                page,
                limit,
                sort,
            };
        }
        // Attendance params
        return {
            month: month ?? new Date().getMonth() + 1,
            year: year ?? new Date().getFullYear(),
        };
    }, [month, year, tab, status, employeeId, leaveTypeId, startDate, endDate, page, limit, sort]);

    const paramsStr = useMemo(() => JSON.stringify(params), [params]);

    const { isLoading, data, refetch, isSuccess } = useQuery({
        queryKey: tab === "2" ? ["leave-applications", params, tab] : ["attendance-report", params, tab],
        queryFn: (): Promise<GetAttendanceReportResponse | GetListLeaveApplicationResponse> => {
            if (tab === "2") {
                return getListLeaveApplication(params as GetListLeaveApplicationRequest);
            }
            return getAttendanceReport(params as GetAttendanceReportRequest);
        },
        enabled: !!tab && (tab === "2" || (!!(params as GetAttendanceReportRequest).month && !!(params as GetAttendanceReportRequest).year)),
    });

    const handleFilterSubmit = (values: GetAttendanceReportRequest | GetListLeaveApplicationRequest) => {
        setSearchParams(
            queryString.stringify(
                {
                    ...values,
                    date_range_picker: undefined,
                    tab: tab ?? 1,
                },
                { arrayFormat: "comma" }
            )
        );
    };

    useEffect(() => {
        if (!tab) {
            setSearchParams(
                queryString.stringify({
                    tab: 1,
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                })
            );
        }
    }, [setSearchParams, tab]);

    return (
        <AttendanceContext.Provider
            value={{
                params,
                paramsStr,
                refetch,
                dataResponse: data,
                isLoading: isLoading,
                isSuccess,
                handleFilterSubmit,
                tab,
            }}
        >
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendanceContext = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error(
            "useAttendanceContext must be used within an AttendanceProvider"
        );
    }
    return context;
};
