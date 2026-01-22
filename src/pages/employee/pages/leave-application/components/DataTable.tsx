import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useEffect, useMemo, useState } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useLeaveApplicationContext } from "../LeaveApplicationContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { LeaveApplication } from "@/apis/leave-application/model/LeaveApplication";
import { LeaveApplicationStatus } from "@/components/common/status";
import showMessage from "@/utils/showMessage";

import { LEAVE_OPTION_MAP } from "@/components/common/form/SelectListLeaveOption";

const DataTable = () => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedLeaveApplication,
    setPopupUpdateLeaveApplication,
    deleteLeaveApplicationMutation,
  } = useLeaveApplicationContext();

  // Using a generic key for now - can be added to store later if needed
  const [listLeaveApplicationActiveKey, setListLeaveApplicationActiveKey] =
    useState<string[] | undefined>(undefined);

  const baseColumns: ColumnsType<LeaveApplication> = useMemo(
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
        dataIndex: ["employee", "employeeCode"],
        key: COLUMN_KEYS.EMPLOYEE_CODE,
        align: "center",
        fixed: "left",
        width: 150,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Tên nhân viên",
        dataIndex: ["employee", "fullName"],
        key: "employee_name",
        width: 200,
        align: "left",
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Loại nghỉ phép",
        dataIndex: ["leaveType", "name"],
        key: "leave_type",
        align: "left",
        width: 180,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Ngày nghỉ",
        dataIndex: "leaveDate",
        key: "start_date",
        align: "center",
        width: 150,
        render: (value) => dayjs(value).format("DD/MM/YYYY"),
      },
      {
        title: "Buổi nghỉ",
        dataIndex: "leaveOption",
        key: "end_date",
        align: "center",
        width: 150,
        render: (value) => {
          if (!value) return "-";
          return LEAVE_OPTION_MAP[value as keyof typeof LEAVE_OPTION_MAP] || value;
        },
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
        align: "left",
        width: 250,
        render: (value) => <TooltipTruncatedText value={value} />,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 150,
        render: (value) => <LeaveApplicationStatus status={value} />,
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
        title: "Hành động",
        key: COLUMN_KEYS.ACTION,
        width: 150,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Space>
            <Button
              type="text"
              onClick={() => {
                setSelectedLeaveApplication(record);
                setPopupUpdateLeaveApplication(true);
              }}
              icon={<EditOutlined style={{ color: "#10b981" }} />}
            />
            <Popconfirm
              title="Xóa đơn nghỉ phép"
              description="Bạn có chắc chắn muốn xóa đơn nghỉ phép này?"
              onConfirm={() => {
                deleteLeaveApplicationMutation.mutate(record.id, {
                  onSuccess: () => {
                    showMessage({
                      level: "success",
                      title: "Xóa đơn nghỉ phép thành công",
                    });
                  },
                  onError: () => {
                    showMessage({
                      level: "error",
                      title: "Xóa đơn nghỉ phép thất bại",
                    });
                  },
                });
              }}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [
      dataResponse?.data.pagination.page,
      dataResponse?.data.pagination.limit,
      setSelectedLeaveApplication,
      setPopupUpdateLeaveApplication,
      deleteLeaveApplicationMutation,
    ]
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listLeaveApplicationActiveKey) {
      setListLeaveApplicationActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [columns, setListLeaveApplicationActiveKey, listLeaveApplicationActiveKey]);

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
      rowKey={(record) => record.id.toString()}
      dataSource={dataResponse?.data.data}
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listLeaveApplicationActiveKey}
      setActiveKeys={setListLeaveApplicationActiveKey}
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
