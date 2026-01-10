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

const DataTable = () => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedDepartment,
  } = useDepartmentContext();

  const { setListDepartmentActiveKey, listDepartmentActiveKey } = useTableStore(
    (state) => state
  );

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
        title: "Mã phòng ban",
        dataIndex: "departmentCode",
        key: COLUMN_KEYS.DEPARTMENT_CODE,
        align: "center",
        fixed: "left",
        width: 150,
        render: (value) => <CopyTextPopover text={value} />,
      },
      {
        title: "Tên phòng ban",
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
              setSelectedDepartment(record);
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
    ]
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listDepartmentActiveKey) {
      setListDepartmentActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [columns, setListDepartmentActiveKey, listDepartmentActiveKey]);

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
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listDepartmentActiveKey}
      setActiveKeys={setListDepartmentActiveKey}
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
