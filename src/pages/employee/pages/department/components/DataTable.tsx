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

const TAB_POSITION_EXCLUDE_COLUMNS = [
  COLUMN_KEYS.DEPARTMENT,
  COLUMN_KEYS.CODE,
  COLUMN_KEYS.DESCRIPTION,
  COLUMN_KEYS.FOUNDED_AT,
];

const DataTable = () => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedDepartment,
    setSelectedPosition,
    tab,
  } = useDepartmentContext();

  const {
    setListDepartmentActiveKey,
    listDepartmentActiveKey,
    setListPositionActiveKey,
    listPositionActiveKey,
  } = useTableStore((state) => state);

  const baseColumns: ColumnsType<DEPARTMENT> = useMemo(
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
        title: tab === TABS.DEPARTMENT ? "Mã phòng ban" : "Mã chức vụ",
        dataIndex: tab === TABS.DEPARTMENT ? "departmentCode" : "code",
        key: COLUMN_KEYS.CODE,
        align: "center",
        fixed: "left",
        width: 150,
        render: (value) => <CopyTextPopover text={value} />,
      },
      {
        title: tab === TABS.DEPARTMENT ? "Tên phòng ban" : "Tên chức vụ",
        dataIndex: "name",
        key: COLUMN_KEYS.NAME,
        width: 140,
        align: "left",
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Người quản lý",
        dataIndex: ["department", "name"],
        key: COLUMN_KEYS.DEPARTMENT,
        align: "left",
        width: 250,
        render: (_, record) => (
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
        ),
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
        title: "Mô tả",
        dataIndex: "description",
        key: COLUMN_KEYS.DESCRIPTION,
        align: "left",
        width: 250,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Ngày thành lập",
        dataIndex: "foundedAt",
        key: COLUMN_KEYS.FOUNDED_AT,
        align: "center",
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
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
              } else {
                setSelectedPosition(record as any);
              }
            }}
            icon={<EditOutlined style={{ color: "#10b981" }} />}
          />
        ),
      },
    ],
    [
      dataResponse?.data.pagination.page,
      dataResponse?.data.pagination.limit,
      setSelectedDepartment,
      tab,
    ]
  );

  const columns = useMemo(() => {
    if (tab === TABS.POSITION) {
      return baseColumns.filter(
        (col) => !TAB_POSITION_EXCLUDE_COLUMNS.includes(col.key as any)
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
  }, [
    columns,
    setListDepartmentActiveKey,
    listDepartmentActiveKey,
    setListPositionActiveKey,
    listPositionActiveKey,
    tab,
  ]);

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

  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id || ""}
      dataSource={dataResponse?.data.data}
      columns={columns as ColumnsType<DEPARTMENT | POSITION>}
      scroll={{ x: true }}
      activeKeys={
        tab === TABS.DEPARTMENT
          ? listDepartmentActiveKey
          : listPositionActiveKey || []
      }
      setActiveKeys={
        tab === TABS.DEPARTMENT
          ? setListDepartmentActiveKey
          : setListPositionActiveKey
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
