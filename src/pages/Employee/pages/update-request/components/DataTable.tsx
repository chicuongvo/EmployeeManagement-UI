import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Tag } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import useTableStore from "@/stores/tableStore";
import { useEffect, useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useUpdateRequestContext } from "../UpdateRequestContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type {
  UpdateRequestResponse,
  RequestStatus,
} from "@/types/UpdateRequest";

interface DataTableProps {
  isMyRequests?: boolean;
}

const DataTable = ({ isMyRequests = false }: DataTableProps = {}) => {
  const {
    dataResponse,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedUpdateRequest,
    setPopupUpdateRequest,
  } = useUpdateRequestContext();

  const { setListUpdateRequestActiveKey, listUpdateRequestActiveKey } =
    useTableStore((state) => state);

  const getStatusTag = (status: RequestStatus) => {
    const statusConfig = {
      PENDING: { color: "warning", text: "Pending" },
      APPROVED: { color: "success", text: "Approved" },
      NOT_APPROVED: { color: "error", text: "Not Approved" },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const baseColumns: ColumnsType<UpdateRequestResponse> = useMemo(
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
        title: "ID",
        dataIndex: "id",
        key: COLUMN_KEYS.ID,
        width: 80,
        fixed: "left",
        align: "center",
      },
      {
        title: "Content",
        dataIndex: "content",
        key: "content",
        width: 300,
        render: (value) => (
          <TooltipTruncatedText value={value} maxLength={50} />
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 120,
        render: (status: RequestStatus) => getStatusTag(status),
      },
      ...(isMyRequests
        ? []
        : [
            {
              title: "Requested By",
              dataIndex: ["requestedBy", "fullName"],
              key: "requestedBy",
              align: "left",
              width: 200,
              render: (value, record) => (
                <div>
                  <div>{value || "-"}</div>
                  {record.requestedBy?.email && (
                    <div className="text-xs text-gray-500">
                      {record.requestedBy.email}
                    </div>
                  )}
                </div>
              ),
            } as const,
          ]),
      {
        title: "Reviewed By",
        dataIndex: ["reviewedBy", "fullName"],
        key: "reviewedBy",
        align: "left",
        width: 200,
        render: (value, record) => (
          <div>
            <div>{value || "-"}</div>
            {record.reviewedBy?.email && (
              <div className="text-xs text-gray-500">
                {record.reviewedBy.email}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        align: "left",
        key: COLUMN_KEYS.CREATED_AT,
        width: 150,
        render: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        align: "left",
        key: COLUMN_KEYS.UPDATED_AT,
        width: 150,
        render: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
      },
      {
        title: "Action",
        key: COLUMN_KEYS.ACTION,
        width: isMyRequests ? 100 : 200,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex gap-1 justify-center">
            {isMyRequests ? (
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedUpdateRequest(record);
                  setPopupUpdateRequest(true);
                }}
              />
            ) : (
              <>
                {record.status !== "PENDING" && (
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setSelectedUpdateRequest(record);
                      setPopupUpdateRequest(true);
                    }}
                  />
                )}
                {record.status === "PENDING" && (
                  <Button
                    type="text"
                    icon={<EditOutlined style={{ color: "#10b981" }} />}
                    onClick={() => {
                      setSelectedUpdateRequest(record);
                      setPopupUpdateRequest(true);
                    }}
                  />
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [
      dataResponse?.pagination.page,
      dataResponse?.pagination.limit,
      setSelectedUpdateRequest,
      setPopupUpdateRequest,
      isMyRequests,
    ]
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listUpdateRequestActiveKey) {
      setListUpdateRequestActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [columns, setListUpdateRequestActiveKey, listUpdateRequestActiveKey]);

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
    ]
  );

  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id?.toString() || ""}
      dataSource={dataResponse?.data}
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listUpdateRequestActiveKey}
      setActiveKeys={setListUpdateRequestActiveKey}
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
