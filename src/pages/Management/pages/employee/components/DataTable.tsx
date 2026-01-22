import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Avatar } from "antd";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useEmployeeContext } from "../EmployeeContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { EMPLOYEE } from "@/apis/employee/model/Employee";
import CopyTextPopover from "@/components/common/shared/CopyTextPopover";
import { WorkStatus } from "@/components/common/status";
import { Link, useLocation } from "react-router-dom";

interface DataTableProps {
  departmentId?: number;
}

const DataTable = ({ departmentId }: DataTableProps = {}) => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedEmployee,
    setPopupUpdateEmployee,
  } = useEmployeeContext();

  const location = useLocation();
  const pathname = location.pathname;
  const isMeRoute = pathname.includes("/me");

  const { setListEmployeeActiveKey, listEmployeeActiveKey } = useTableStore(
    (state) => state,
  );

  const baseColumns: ColumnsType<EMPLOYEE> = useMemo(
    () => [
      {
        title: "STT",
        key: COLUMN_KEYS.NO,
        render: (_, __, index: number) => {
          const currentPage = dataResponse?.data.pagination.page ?? 1;
          const pageSize = dataResponse?.data.pagination.limit ?? 10;
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: "Mã nhân viên",
        dataIndex: "employeeCode",
        key: COLUMN_KEYS.EMPLOYEE_CODE,
        align: "center",
        fixed: "left",
        width: 150,
        render: (value, record) => {
          if (isMeRoute) {
            return <CopyTextPopover text={value} />;
          }
          return (
            <Link to={`/management/employees/${record.id}`}>
              <CopyTextPopover text={value} />
            </Link>
          );
        },
      },
      {
        title: "Họ và tên",
        dataIndex: "employeeCode",
        key: COLUMN_KEYS.FULL_NAME,
        width: 250,
        align: "left",
        fixed: "left",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Avatar
              src={
                record.avatar ??
                "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
              }
              size={40}
              className="rounded-full"
              style={{ flexShrink: 0 }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{record.fullName}</span>
              <span className="text-xs text-gray-500">{record.email}</span>
            </div>
          </div>
        ),
      },
      {
        title: "Phòng ban",
        dataIndex: ["department", "name"],
        key: COLUMN_KEYS.DEPARTMENT,
        align: "left",
        width: 200,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Vị trí",
        dataIndex: ["position", "name"],
        key: COLUMN_KEYS.POSITION,
        align: "left",
        width: 200,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Quản lý trực tiếp",
        dataIndex: ["directManager", "fullName"],
        key: "directManager",
        align: "left",
        width: 200,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "SĐT",
        dataIndex: "phone",
        key: COLUMN_KEYS.PHONE,
        align: "left",
        width: 120,
        render: (value) => <TooltipTruncatedText value={value} />,
      },

      {
        title: "Trạng thái",
        dataIndex: "workStatus",
        key: COLUMN_KEYS.WORK_STATUS,
        align: "center",
        width: 150,
        render: (value) => <WorkStatus status={value} />,
      },
      {
        title: "Ngày nhận việc",
        dataIndex: "onboardDate",
        align: "left",
        key: COLUMN_KEYS.ONBOARD_DATE,
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "left",
        key: COLUMN_KEYS.CREATED_AT,
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
    ],
    [
      dataResponse?.data.pagination.page,
      dataResponse?.data.pagination.limit,
      setSelectedEmployee,
      setPopupUpdateEmployee,
      departmentId,
      isMeRoute,
    ],
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listEmployeeActiveKey) {
      setListEmployeeActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION),
      );
    }
  }, [columns, setListEmployeeActiveKey, listEmployeeActiveKey]);

  // Apply department filter when departmentId prop is provided
  useEffect(() => {
    if (departmentId) {
      handleFilterSubmit?.({
        ...params,
        departmentId,
      });
    }
  }, [departmentId]);

  const paginationConfig = useMemo(
    () => ({
      total: dataResponse?.data.pagination.total || 0,
      pageSize: dataResponse?.data.pagination.limit || 10,
      current: dataResponse?.data.pagination.page || 1,
      showTotal: (total: number) => (
        <span>
          <span className="font-bold">Total:</span> {total}
        </span>
      ),
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    }),
    [
      dataResponse?.data.pagination.total,
      dataResponse?.data.pagination.limit,
      dataResponse?.data.pagination.page,
    ],
  );

  console.log("dataResponse", dataResponse?.data.pagination);
  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id || ""}
      dataSource={dataResponse?.data.data}
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listEmployeeActiveKey}
      setActiveKeys={setListEmployeeActiveKey}
      pagination={paginationConfig}
      onChange={(p) => {
        console.log("p", p);
        handleFilterSubmit?.({
          ...params,
          page: p.current,
          limit: p.pageSize,
        });
      }}
      editColumnMode={true}
    />
  );
};

export default DataTable;
