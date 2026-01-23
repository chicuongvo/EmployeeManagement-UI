import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Popconfirm, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useEffect, useMemo, useState } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useNotificationContext } from "../../../NotificationContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import TableComponent from "@/components/common/table/TableComponent";
import type { Notification } from "@/apis/notification/model/Notification";
import showMessage from "@/utils/showMessage";

const DataTable = () => {
  const {
    dataResponse,
    isLoading,
    isSuccess,
    handleFilterSubmit,
    params,
    setSelectedNotification,
    setPopupUpdateNotification,
    deleteNotificationMutation,
  } = useNotificationContext();

  // Using a generic key for now - can be added to store later if needed
  const [listNotificationActiveKey, setListNotificationActiveKey] =
    useState<string[] | undefined>(undefined);

  const baseColumns: ColumnsType<Notification> = useMemo(
    () => [
      {
        title: "STT",
        key: COLUMN_KEYS.NO,
        render: (_, __, index: number) => {
          const currentPage = dataResponse?.data.pagination.page ?? 1;
          const pageSize = dataResponse?.data.pagination.limit ?? 10;
          return (currentPage - 1) * pageSize + index + 1;
        },
        width: 60,
        fixed: "left",
        align: "center",
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        render: (value: string) => <TooltipTruncatedText value={value} />,
        width: 200,
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        render: (value: string) => <TooltipTruncatedText value={value} />,
        width: 300,
      },
      
      {
        title: "Ngày công bố",
        dataIndex: "publishedAt",
        key: "publishedAt",
        render: (date: string) =>
          date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
        width: 150,
        align: "center",
      },
      {
        title: "Trạng thái",
        dataIndex: "isRead",
        key: "isRead",
        render: (isRead: boolean) => (
          <Tag color={isRead ? "green" : "orange"}>
            {isRead ? "Đã đọc" : "Chưa đọc"}
          </Tag>
        ),
        width: 100,
        align: "center",
      },
      {
        title: "Hành động",
        key: COLUMN_KEYS.ACTION,
        width: 150,
        fixed: "right",
        align: "center",
        render: (_, record: Notification) => (
          <Space>
            <Button
              type="text"
              onClick={() => {
                setSelectedNotification(record);
                setPopupUpdateNotification(true);
              }}
              icon={<EditOutlined style={{ color: "#10b981" }} />}
            />
            <Popconfirm
              title="Xóa thông báo"
              description="Bạn có chắc chắn muốn xóa thông báo này?"
              onConfirm={() => {
                deleteNotificationMutation.mutate(record.id, {
                  onSuccess: () => {
                    showMessage({
                      level: "success",
                      title: "Xóa thông báo thành công",
                    });
                  },
                  onError: () => {
                    showMessage({
                      level: "error",
                      title: "Xóa thông báo thất bại",
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
      deleteNotificationMutation,
      setPopupUpdateNotification,
      setSelectedNotification,
    ],
  );

  const columns = useMemo(() => {
    return baseColumns;
  }, [baseColumns]);

  useEffect(() => {
    if (!listNotificationActiveKey) {
      setListNotificationActiveKey(
        columns
          .map((col) => col.key as string)
          .filter((key) => key !== COLUMN_KEYS.ACTION)
      );
    }
  }, [columns, setListNotificationActiveKey, listNotificationActiveKey]);

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

  const notifications = dataResponse?.data.notifications || [];

  return (
    <TableComponent
      isSuccess={isSuccess}
      rowKey={(record) => record.id.toString()}
      dataSource={notifications}
      columns={columns}
      scroll={{ x: true }}
      activeKeys={listNotificationActiveKey}
      setActiveKeys={setListNotificationActiveKey}
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
