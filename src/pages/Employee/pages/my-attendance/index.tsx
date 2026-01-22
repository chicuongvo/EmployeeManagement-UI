import { PageContainer } from "@ant-design/pro-components";
import { Card, Table, DatePicker, Space, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getMyAttendance, type MyAttendanceRecord } from "@/apis/my-attendance";
import PageTitle from "@/components/common/shared/PageTitle";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";

const MyAttendancePage = () => {
  const currentDate = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.year());

  const { data, isLoading } = useQuery({
    queryKey: ["my-attendance", selectedMonth, selectedYear],
    queryFn: () => getMyAttendance(selectedMonth, selectedYear),
  });

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time;
  };

  const columns: ColumnsType<MyAttendanceRecord> = [
    {
      title: "Ngày",
      dataIndex: "day",
      key: "day",
      width: 100,
      render: (day: number) => {
        const dateStr = `${day}/${selectedMonth}/${selectedYear}`;
        return (
          <div>
            <div>{dateStr}</div>
            <div className="text-gray-500 text-xs">
              {dayjs(`${selectedYear}-${selectedMonth}-${day}`).format("dddd")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Giờ vào",
      dataIndex: "checkinTime",
      key: "checkinTime",
      width: 120,
      render: (time: string | null) => (
        <span
          className={time ? "text-green-600 font-semibold" : "text-gray-400"}
        >
          {formatTime(time)}
        </span>
      ),
    },
    {
      title: "Giờ ra",
      dataIndex: "checkoutTime",
      key: "checkoutTime",
      width: 120,
      render: (time: string | null) => (
        <span
          className={time ? "text-blue-600 font-semibold" : "text-gray-400"}
        >
          {formatTime(time)}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_, record: MyAttendanceRecord) => {
        if (!record.checkinTime && !record.checkoutTime) {
          return <Tag color="default">Chưa chấm công</Tag>;
        }
        if (record.checkinTime && record.checkoutTime) {
          return <Tag color="green">Đầy đủ</Tag>;
        }
        return <Tag color="orange">Chưa đầy đủ</Tag>;
      },
    },
  ];

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedMonth(date.month() + 1);
      setSelectedYear(date.year());
    }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            { title: "Thông tin cá nhân" },
            { title: "Lịch sử chấm công" },
          ],
        },
      }}
      title={<PageTitle title="Lịch sử chấm công của tôi" />}
      extra={[
        <Space key="filters">
          <DatePicker
            picker="month"
            value={dayjs(`${selectedYear}-${selectedMonth}`, "YYYY-M")}
            onChange={handleMonthChange}
            format="MM/YYYY"
            placeholder="Chọn tháng"
            allowClear={false}
          />
        </Space>,
      ]}
    >
      <Card>
        <Table
          columns={columns}
          dataSource={data?.data.data || []}
          loading={isLoading}
          rowKey="day"
          pagination={false}
          summary={() => {
            const total = data?.data.data?.length || 0;
            const completed =
              data?.data.data?.filter(
                (item) => item.checkinTime && item.checkoutTime,
              ).length || 0;
            const incomplete =
              data?.data.data?.filter(
                (item) =>
                  (item.checkinTime || item.checkoutTime) &&
                  !(item.checkinTime && item.checkoutTime),
              ).length || 0;
            const absent = total - completed - incomplete;

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <div className="flex gap-6">
                    <span>
                      <strong>Tổng số ngày:</strong> {total}
                    </span>
                    <span>
                      <Tag color="green">Đầy đủ: {completed}</Tag>
                    </span>
                    <span>
                      <Tag color="orange">Chưa đầy đủ: {incomplete}</Tag>
                    </span>
                    <span>
                      <Tag color="default">Chưa chấm công: {absent}</Tag>
                    </span>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default MyAttendancePage;
