import { useDepartmentDetailContext } from "../DepartmentDetailContext";
import DataTable from "../../employee/components/DataTable";
import { EmployeeProvider } from "../../employee/EmployeeContext";

const DepartmentEmployeeList = () => {
    const { department } = useDepartmentDetailContext();

    return (
        <EmployeeProvider>
            <DataTable departmentId={department?.id} />
        </EmployeeProvider>
    );
};

export default DepartmentEmployeeList;
