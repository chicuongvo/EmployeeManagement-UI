import { useEffect, useState } from "react";
import { useDepartmentDetailContext } from "../DepartmentDetailContext";
import DataTable from "../../employee/components/DataTable";
import { EmployeeProvider, useEmployeeContext } from "../../employee/EmployeeContext";
import { Input } from "antd";
import { useDebounce } from "@/hooks/useDebounce";

const { Search } = Input;

const EmployeeSearchToolbar = ({ departmentId }: { departmentId?: number }) => {
    const { handleFilterSubmit, params } = useEmployeeContext();
    const [searchValue, setSearchValue] = useState(params.q || "");
    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        handleFilterSubmit({
            ...params,
            q: debouncedSearchValue.trim() || undefined,
            departmentId,
            page: 1,
        });
    }, [debouncedSearchValue, departmentId]);

    return (
        <Search
            placeholder="Mã/tên nhân viên..."
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={(value) => setSearchValue(value)}
            style={{ width: 200 }}
            className="custom-search"
        />
    );
};

const DepartmentEmployeeList = () => {
    const { department } = useDepartmentDetailContext();

    return (
        <EmployeeProvider>
            <div className="flex items-center justify-end">
                <EmployeeSearchToolbar departmentId={department?.id} />
            </div>
            <DataTable departmentId={department?.id} />
        </EmployeeProvider>
    );
};

export default DepartmentEmployeeList;
