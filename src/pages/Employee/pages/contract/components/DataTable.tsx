import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Tag, Tooltip } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useContractContext } from "../ContractContext";

import TableComponent from "@/components/common/table/TableComponent";
import type {
  ContractResponse,
  ContractStatus,
  ContractType,
} from "@/types/Contract";

interface DataTableProps {
  isMyContracts?: boolean;
}

const DataTable = ({ isMyContracts = false }: DataTableProps = {}) => {
  const { dataResponse, isSuccess, handleFilterSubmit, params } =
    useContractContext();
  const navigate = useNavigate();

  const { setListContractActiveKey, listContractActiveKey } = useTableStore(
    (state) => state,
  );

  const getStatusTag = (status: ContractStatus) => {
    const statusConfig: Record<
      ContractStatus,
      { color: string; text: string }
    > = {
      DRAFT: { color: "default", text: "Nháp" },
      ACTIVE: { color: "success", text: "Đang hoạt động" },
      EXPIRED: { color: "error", text: "Hết hạn" },
      TERMINATED: { color: "error", text: "Đã chấm dứt" },
      PENDING: { color: "warning", text: "Chờ duyệt" },
      RENEWED: { color: "processing", text: "Đã gia hạn" },
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: ContractType) => {
    const typeConfig: Record<ContractType, { color: string; text: string }> = {
      FULL_TIME: { color: "blue", text: "Toàn thời gian" },
      PART_TIME: { color: "cyan", text: "Bán thời gian" },
      INTERNSHIP: { color: "purple", text: "Thực tập" },
      PROBATION: { color: "orange", text: "Thử việc" },
      TEMPORARY: { color: "geekblue", text: "Tạm thời" },
      FREELANCE: { color: "green", text: "Freelance" },
      OUTSOURCE: { color: "lime", text: "Outsource" },
    };
    const config = typeConfig[type] || typeConfig.FULL_TIME;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const baseColumns: ColumnsType<ContractResponse> = useMemo(
    () => [
      {
        title: "No",
        key: COLUMN_KEYS.NO,
        render: (_, __, index: number) => {
          const currentPage = dataResponse?.pagination.page ?? 1;
          const pageSize = dataResponse?.pagination.limit ?? 10;
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: "Mã hợp đồng",
        dataIndex: "contractCode",
        key: "contractCode",
        width: 150,
        align: "center",
        fixed: "left",
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        align: "center",
        fixed: "left",
        width: 120,
        render: (type: ContractType) => getTypeTag(type),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 120,
        render: (status: ContractStatus) => getStatusTag(status),
      },
      {
        title: "Nhân viên",
        dataIndex: ["employee", "fullName"],
        key: "employee",
        align: "left",
        width: 200,
        render: (value, record) => (
          <div>
            <div>{value || "-"}</div>
            {record.employee?.email && (
              <div className="text-xs text-gray-500">
                {record.employee.email}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        align: "left",
        key: "startDate",
        width: 120,
        render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        align: "left",
        key: "endDate",
        width: 120,
        render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
      },
      {
        title: "File đính kèm",
        dataIndex: "attachment",
        key: "attachment",
        align: "center",
        width: 120,
        render: (attachment: string | null, record) => {
          if (!attachment) {
            return <span className="text-gray-400">-</span>;
          }

          const isPDF = attachment.match(/\.pdf$/i);
          const isImage = attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i);

          return (
            <div className="flex items-center justify-center gap-2">
              {isPDF ? (
                <Tooltip title="Xem PDF">
                  <Button
                    type="text"
                    size="small"
                    icon={<FileTextOutlined className="text-red-600 text-lg" />}
                    onClick={() => {
                      window.open(attachment, "_blank");
                    }}
                  />
                </Tooltip>
              ) : isImage ? (
                <div className="w-8 h-8 rounded overflow-hidden border">
                  <img
                    src={attachment}
                    alt="Contract file"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <FileTextOutlined className="text-gray-600 text-lg" />
              )}
              <Tooltip title="Tải xuống">
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = attachment;
                    link.download = `${record.contractCode}${isPDF ? ".pdf" : isImage ? ".jpg" : ""}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: "Action",
        key: COLUMN_KEYS.ACTION,
        width: isMyContracts ? 80 : 120,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex gap-1 justify-center">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  if (isMyContracts) {
                    navigate(`/employee/my-contracts/${record.id}`);
                  } else {
                    navigate(`/management/contracts/${record.id}`);
                  }
                }}
              />
            </Tooltip>
            {!isMyContracts && (
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/management/contracts/${record.id}`);
                  }}
                />
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [
      dataResponse?.pagination.page,
      dataResponse?.pagination.limit,
      isMyContracts,
      navigate,
    ],
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listContractActiveKey) {
      setListContractActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION),
      );
    }
  }, [columns, setListContractActiveKey, listContractActiveKey]);

  const paginationConfig = useMemo(
    () => ({
      total: dataResponse?.pagination.total || 0,
      pageSize: dataResponse?.pagination.limit || 10,
      current: dataResponse?.pagination.page || 1,
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
      dataResponse?.pagination.total,
      dataResponse?.pagination.limit,
      dataResponse?.pagination.page,
    ],
  );

  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id?.toString() || ""}
      dataSource={dataResponse?.data}
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listContractActiveKey}
      setActiveKeys={setListContractActiveKey}
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
