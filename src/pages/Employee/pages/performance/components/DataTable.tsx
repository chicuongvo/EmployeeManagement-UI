import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo } from "react";

import { usePerformanceContext } from "../PerformanceContext";
import type { Performance } from "@/apis/performance/performanceService";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Tooltip } from "antd";
import { CalendarOutlined, FileTextOutlined, TeamOutlined } from "@ant-design/icons";

const DataTable = () => {
  const navigate = useNavigate();
  const { dataResponse, isLoading, handleFilterSubmit, params } =
    usePerformanceContext();

  const baseColumns: ColumnsType<Performance> = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
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
        title: "ID Báo cáo",
        dataIndex: "id",
        key: "id",
        align: "center",
        width: 120,
        render: (value) => (
          <Tag color="blue" className="font-semibold">
            #{value}
          </Tag>
        ),
      },
      {
        title: "Kỳ đánh giá",
        key: "period",
        width: 180,
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <CalendarOutlined className="text-blue-500" />
            <span className="font-medium">
              Tháng {record.month}/{record.year}
            </span>
          </div>
        ),
      },
      {
        title: "Tháng",
        dataIndex: "month",
        key: "month",
        align: "center",
        width: 100,
        render: (value) => (
          <Tag color="cyan">Tháng {value}</Tag>
        ),
      },
      {
        title: "Năm",
        dataIndex: "year",
        key: "year",
        align: "center",
        width: 100,
        render: (value) => (
          <Tag color="purple">{value}</Tag>
        ),
      },
      {
        title: "Số lượng đánh giá",
        dataIndex: "details",
        key: "detailsCount",
        align: "center",
        width: 150,
        render: (details) => (
          <div className="flex items-center justify-center gap-2">
            <TeamOutlined className="text-green-500" />
            <span>{details?.length || 0} nhân viên</span>
          </div>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "center",
        key: "createdAt",
        width: 180,
        render: (value) => (
          <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
            {dayjs(value).format("DD/MM/YYYY HH:mm")}
          </Tooltip>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        align: "center",
        width: 120,
        fixed: "right",
        render: (_, record) => (
          <Tooltip title="Xem chi tiết">
            <button
              onClick={() => navigate(`/performance/${record.id}`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <FileTextOutlined />
              Chi tiết
            </button>
          </Tooltip>
        ),
      },
    ],
    [dataResponse?.data.pagination.page, dataResponse?.data.pagination.limit, navigate]
  );

  return (
    <Table<Performance>
      columns={baseColumns}
      dataSource={dataResponse?.data.data || []}
      rowKey="id"
      loading={isLoading}
      bordered
      scroll={{ x: 1000 }}
      pagination={{
        current: dataResponse?.data.pagination.page ?? 1,
        pageSize: dataResponse?.data.pagination.limit ?? 10,
        total: dataResponse?.data.pagination.total ?? 0,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} báo cáo`,
        onChange: (page, pageSize) => {
          handleFilterSubmit({
            ...params,
            page,
            limit: pageSize,
          });
        },
      }}
      onRow={(record) => ({
        onClick: () => navigate(`/performance/${record.id}`),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default DataTable;
