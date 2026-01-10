import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Avatar, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useEmployeeContext } from "../EmployeeContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { EMPLOYEE } from "@/apis/employee/model/Employee";
import CopyTextPopover from "@/components/common/shared/CopyTextPopover";
import { WorkStatus } from "@/components/common/status";

const DataTable = () => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedEmployee,
    setPopupUpdateEmployee,
  } = useEmployeeContext();

  const { setListEmployeeActiveKey, listEmployeeActiveKey } = useTableStore(
    (state) => state
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
        width: 120,
        render: (value) => <CopyTextPopover text={value} />,
      },
      {
        title: "Họ và tên",
        dataIndex: "employeeCode",
        key: COLUMN_KEYS.FULL_NAME,
        width: 250,
        align: "left",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Avatar src={record.avatar} size={40} />
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
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "left",
        key: COLUMN_KEYS.CREATED_AT,
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        align: "left",
        key: COLUMN_KEYS.UPDATED_AT,
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Hành động",
        key: COLUMN_KEYS.ACTION,
        width: 120,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Button
            type="text"
            onClick={() => {
              setSelectedEmployee(record);
              setPopupUpdateEmployee(true);
            }}
            icon={<EditOutlined style={{ color: "#10b981" }} />}
          />
        ),
      },
    ],
    [
      dataResponse?.data.pagination.page,
      dataResponse?.data.pagination.limit,
      setSelectedEmployee,
      setPopupUpdateEmployee,
    ]
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listEmployeeActiveKey) {
      setListEmployeeActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [columns, setListEmployeeActiveKey, listEmployeeActiveKey]);

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
    ]
  );

  console.log("dataResponse", dataResponse?.data.data);
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
      onChange={(p) =>
        handleFilterSubmit?.({
          ...params,
          page: p.current,
          limit: p.pageSize,
        })
      }
      editColumnMode={true}
    />
  );
};

export default DataTable;
