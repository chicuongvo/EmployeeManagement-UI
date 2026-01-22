import type { RouteItem } from "@/routes";
import AttendanceManagementPage from "./AttendanceManagementPage";

const attendance_route: RouteItem = {
  path: "/attendance/reports",
  name: "Báo cáo chấm công",
  element: <AttendanceManagementPage />,
};

export default attendance_route;
