import { useDepartmentDetailContext } from "../DepartmentDetailContext";

const DepartmentHeader = () => {
    const { department } = useDepartmentDetailContext();

    if (!department) return null;

    return (
        <div className="mb-6">
            <h1 className="text-3xl font-semibold text-navy-800 mb-1">
                #{department.departmentCode}
            </h1>
            <p className="text-sm text-gray-500">Hồ sơ phòng ban</p>
        </div>
    );
};

export default DepartmentHeader;
