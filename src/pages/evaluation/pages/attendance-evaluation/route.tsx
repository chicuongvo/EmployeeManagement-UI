import { AttendanceProvider } from "./AttendanceContext";
import AttendancePage from "./index";

const AttendanceRoute = () => {
    return (
        <AttendanceProvider>
            <AttendancePage />
        </AttendanceProvider>
    );
};

export default AttendanceRoute;
