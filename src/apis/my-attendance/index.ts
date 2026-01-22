import { axiosClient } from "@/lib/axios";

export interface MyAttendanceRecord {
  day: number;
  checkinTime: string | null;
  checkoutTime: string | null;
  attendanceReportDetailId: number | null;
}

export interface MyAttendanceResponse {
  code: number;
  message: string;
  data: {
    month: number;
    year: number;
    data: MyAttendanceRecord[];
  };
}

export const getMyAttendance = async (month?: number, year?: number) => {
  const params: any = {};
  if (month) params.month = month;
  if (year) params.year = year;

  const response = await axiosClient.get<MyAttendanceResponse>(
    "/attendance-report-details/my-attendance",
    { params },
  );
  return response.data;
};
