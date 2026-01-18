import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useMemo } from "react";
import { COLUMN_KEYS } from "@/constant/columns";

import { useNotificationContext } from "../../../NotificationContext";
import TooltipTruncatedText from "@/components/common/shared/TooltipTruncatedText";
import type { Notification } from "@/apis/notification/model/Notification";
import showMessage from "@/utils/showMessage";

const DataTable = () => {
  const {
    dataResponse,
    isLoading,
    handleFilterSubmit,
    params,
    setSelectedNotification,
    setPopupUpdateNotification,
    deleteNotificationMutation,
  } = useNotificationContext();

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
        title: "Người tạo",
        dataIndex: "creatorName",
        key: "creatorName",
        width: 150,
        render: (text: string) => text || "-",
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
        title: "Thao tác",
        key: "action",
        width: 150,
        align: "center",
        fixed: "right",
        render: (_, record: Notification) => (
          <Space size="small">
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
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [
      dataResponse,
      deleteNotificationMutation,
      setPopupUpdateNotification,
      setSelectedNotification,
    ],
  );

  const notifications = dataResponse?.data.notifications || [];

  return (
    <Table
      columns={baseColumns}
      dataSource={notifications}
      rowKey={record => record.id}
      loading={isLoading}
      pagination={{
        current: dataResponse?.data.pagination.page || 1,
        pageSize: dataResponse?.data.pagination.limit || 10,
        total: dataResponse?.data.pagination.total || 0,
        showSizeChanger: false,
        showTotal: total => `Tổng ${total} thông báo`,
        onChange: page => {
          handleFilterSubmit({
            ...params,
            page,
          });
        },
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default DataTable;
