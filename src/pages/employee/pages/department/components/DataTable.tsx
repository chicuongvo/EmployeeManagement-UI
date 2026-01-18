/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Avatar, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useDepartmentContext } from "../DepartmentContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import CopyTextPopover from "@/components/common/shared/CopyTextPopover";
import type { DEPARTMENT } from "@/apis/department";
import ActiveStatus from "@/components/common/status/ActiveStatus";
import { TABS } from "..";
import type { POSITION } from "@/apis/position/model/Position";
import { Link } from "react-router-dom";
import type { ROLE } from "@/apis/role";

const TAB_POSITION_EXCLUDE_COLUMNS = [
  COLUMN_KEYS.CODE,
  COLUMN_KEYS.DESCRIPTION,
  COLUMN_KEYS.FOUNDED_AT,
  COLUMN_KEYS.LEVEL

];

const TAB_ROLE_EXCLUDE_COLUMNS = [
  COLUMN_KEYS.CODE,
  COLUMN_KEYS.DEPARTMENT,
  COLUMN_KEYS.EMPLOYEE_NUMBER,
  COLUMN_KEYS.DESCRIPTION,
  COLUMN_KEYS.FOUNDED_AT,
  COLUMN_KEYS.ROLE_NAME,
];

const TAB_DEPARTMENT_EXCLUDE_COLUMNS = [
  COLUMN_KEYS.ROLE_NAME,
  COLUMN_KEYS.LEVEL
]

const DataTable = () => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedDepartment,
    setSelectedPosition,
    setSelectedRole,
    tab,
  } = useDepartmentContext();

  const {
    setListDepartmentActiveKey,
    listDepartmentActiveKey,
    setListPositionActiveKey,
    listPositionActiveKey,
    setListRoleActiveKey,
    listRoleActiveKey,
  } = useTableStore((state) => state);

  const baseColumns: ColumnsType<DEPARTMENT | POSITION | ROLE | any> = useMemo(
    () => [
      {
        title: "STT",
        key: COLUMN_KEYS.NO,
        render: (_, __, index: number) => {
          const pagination = (dataResponse as any)?.data?.pagination || (dataResponse as any)?.pagination || (dataResponse as any);
          const currentPage = pagination?.page ?? 1;
          const pageSize = pagination?.limit ?? 10;
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: tab === TABS.DEPARTMENT ? "Mã phòng ban" : tab === TABS.POSITION ? "Mã chức vụ" : "Mã Chức danh",
        dataIndex: tab === TABS.DEPARTMENT ? "departmentCode" : "code",
        key: COLUMN_KEYS.CODE,
        align: "center",
        fixed: "left",
        width: 150,
        render: (value, record) => <Link to={`/employee/departments/${record.id}`} className="text-blue-600 hover:text-blue-800">
          <CopyTextPopover text={value} /></Link>,
      },
      {
        title: tab === TABS.DEPARTMENT ? "Tên phòng ban" : tab === TABS.POSITION ? "Tên chức vụ" : "Tên Chức danh",
        dataIndex: "name",
        key: COLUMN_KEYS.NAME,
        width: 200,
        align: "left",
      },
      {
        title: tab === TABS.DEPARTMENT ? "Người quản lý" : "Phòng ban",
        dataIndex: tab === TABS.DEPARTMENT ? ["manager"] : ["department"],
        key: COLUMN_KEYS.DEPARTMENT,
        align: "left",
        width: 250,
        render: (_, record) => {
          if (tab === TABS.DEPARTMENT) {
            return (
              <div className="flex items-center gap-2">
                <Avatar
                  src={
                    record.manager?.avatar ??
                    "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
                  }
                  style={{ flexShrink: 0 }}
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {record.manager?.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {record.manager?.email}
                  </span>
                </div>
              </div>
            );
          } else {
            // Position tab - show department
            const item = record as any;
            return item.department ? (
              <div className="flex flex-col">
                <Link to={`/employee/departments/${item.department.id}`} className="text-blue-600 hover:text-blue-800">
                  <CopyTextPopover text={item.department.departmentCode} />
                </Link>
                <span className="text-xs text-gray-500">
                  {item.department.name}
                </span>
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            );
          }
        },
      },
      {
        title: "Số lượng nhân viên",
        dataIndex: "employees",
        key: COLUMN_KEYS.EMPLOYEE_NUMBER,
        width: 200,
        align: "center",
        render: (value) => value?.length || 0,
      },
      {
        title: "Chức danh",
        dataIndex: ["role", "name"],
        key: COLUMN_KEYS.ROLE_NAME,
        align: "left",
        width: 150,
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: COLUMN_KEYS.DESCRIPTION,
        align: "left",
        width: 250,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: COLUMN_KEYS.FOUNDED_AT,
        align: "center",
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Cấp bậc",
        dataIndex: "level",
        key: COLUMN_KEYS.LEVEL,
        align: "center",
        width: 150,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: COLUMN_KEYS.STATUS,
        align: "center",
        width: 150,
        render: (value) => <ActiveStatus status={value} />,
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
              if (tab === TABS.DEPARTMENT) {
                setSelectedDepartment(record as DEPARTMENT);
              } else if (tab === TABS.POSITION) {
                setSelectedPosition(record as POSITION);
              } else {
                setSelectedRole(record as ROLE);
              }
            }}
            icon={<EditOutlined style={{ color: "#10b981" }} />}
          />
        ),
      },
    ],
    [
      (dataResponse as any)?.data?.pagination?.page || (dataResponse as any)?.pagination?.page || (dataResponse as any)?.page,
      (dataResponse as any)?.data?.pagination?.limit || (dataResponse as any)?.pagination?.limit || (dataResponse as any)?.limit,
      setSelectedDepartment,
      tab,
    ]
  );

  const columns = useMemo(() => {
    if (tab === TABS.DEPARTMENT) {
      return baseColumns.filter(
        (col) => !TAB_DEPARTMENT_EXCLUDE_COLUMNS.includes(col.key as any)
      );
    }

    if (tab === TABS.POSITION) {
      return baseColumns.filter(
        (col) => !TAB_POSITION_EXCLUDE_COLUMNS.includes(col.key as any)
      );
    }
    if (tab === TABS.ROLE) {
      return baseColumns.filter(
        (col) => !TAB_ROLE_EXCLUDE_COLUMNS.includes(col.key as any)
      );
    }
    return baseColumns;
  }, [baseColumns, tab]);

  useEffect(() => {
    if (tab === TABS.DEPARTMENT && !listDepartmentActiveKey) {
      setListDepartmentActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
    if (tab === TABS.POSITION && !listPositionActiveKey) {
      setListPositionActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
    if (tab === TABS.ROLE && !listRoleActiveKey) {
      setListRoleActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [
    columns,
    setListDepartmentActiveKey,
    listDepartmentActiveKey,
    setListPositionActiveKey,
    listPositionActiveKey,
    tab,
  ]);

  const paginationConfig = useMemo(() => {
    const pagination = (dataResponse as any)?.data?.pagination || (dataResponse as any)?.pagination || (dataResponse as any);
    return {
      total: pagination?.total || 0,
      pageSize: pagination?.limit || 10,
      current: pagination?.page || 1,
      showTotal: (total: number) => (
        <span>
          <span className="font-bold">Total:</span> {total}
        </span>
      ),
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
    };
  }, [dataResponse]);

  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id || ""}
      dataSource={(dataResponse as any)?.data?.data || (dataResponse as any)?.data || (dataResponse as any)?.items}
      columns={columns as ColumnsType<DEPARTMENT | POSITION | ROLE | any>}
      scroll={{ x: true }}
      activeKeys={
        tab === TABS.DEPARTMENT
          ? listDepartmentActiveKey
          : tab === TABS.POSITION
            ? listPositionActiveKey
            : listRoleActiveKey || []
      }
      setActiveKeys={
        tab === TABS.DEPARTMENT
          ? setListDepartmentActiveKey
          : tab === TABS.POSITION
            ? setListPositionActiveKey
            : setListRoleActiveKey
      }
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
