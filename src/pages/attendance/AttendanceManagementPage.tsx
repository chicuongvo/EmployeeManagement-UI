import { useState } from "react";
import {
  Card,
  DatePicker,
  Radio,
  Space,
  Statistic,
  Row,
  Col,
  Tag,
  Avatar,
  Typography,
  Button,
  message,
  Calendar,
  Badge,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";

import TableComponent from "@/components/common/table/TableComponent";
import {
  getDailyAttendanceReport,
  getMonthlyAttendanceReport,
  createMonthlyAttendanceReport,
  getHolidays,
  type DailyAttendanceEmployee,
  type MonthlyAttendanceEmployee,
  type Holiday,
} from "@/apis/attendance";

const { Title, Text } = Typography;

type ViewMode = "daily" | "monthly";

const AttendanceManagementPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const day = selectedDate.date();
  const month = selectedDate.month() + 1;
  const year = selectedDate.year();

  // Fetch daily report
  const {
    data: dailyData,
    isLoading: isDailyLoading,
    error: dailyError,
  } = useQuery({
    queryKey: ["dailyAttendance", day, month, year],
    queryFn: () => getDailyAttendanceReport(day, month, year),
    enabled: viewMode === "daily",
    retry: 1,
  });

  // Fetch monthly report
  const {
    data: monthlyData,
    isLoading: isMonthlyLoading,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useQuery({
    queryKey: ["monthlyAttendance", month, year],
    queryFn: async () => {
      try {
        return await getMonthlyAttendanceReport(month, year);
      } catch (error: any) {
        // Nếu chưa có báo cáo, tự động tạo
        if (error?.response?.status === 404 || !error?.response) {
          message.info(`Đang tạo báo cáo tháng ${month}/${year}...`);
          await createMonthlyAttendanceReport(month, year);
          return await getMonthlyAttendanceReport(month, year);
        }
        throw error;
      }
    },
    enabled: viewMode === "monthly",
    retry: 1,
  });

  // Fetch holidays for the selected month
  const { data: holidaysData } = useQuery({
    queryKey: ["holidays", month, year],
    queryFn: () => getHolidays(month, year),
    retry: 1,
  });

  // Create monthly report mutation
  const createReportMutation = useMutation({
    mutationFn: () => createMonthlyAttendanceReport(month, year),
    onSuccess: () => {
      message.success(`Tạo báo cáo tháng ${month}/${year} thành công`);
      refetchMonthly();
    },
    onError: (error: any) => {
      message.error(error?.message || "Có lỗi xảy ra khi tạo báo cáo");
    },
  });

  const currentError = viewMode === "daily" ? dailyError : monthlyError;

  // Daily columns
  const dailyColumns: ColumnsType<DailyAttendanceEmployee> = [
    {
      title: "Mã NV",
      dataIndex: ["employee", "employeeCode"],
      key: "employeeCode",
      width: 100,
      fixed: "left",
    },
    {
      title: "Nhân viên",
      key: "employee",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Avatar src={record?.employee?.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">
              {record?.employee?.fullName || "N/A"}
            </div>
            <Text type="secondary" className="text-xs">
              {record?.employee?.email || ""}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Check-in",
      dataIndex: "checkinTime",
      key: "checkinTime",
      width: 120,
      render: (time) =>
        time && typeof time === "string" ? time.slice(0, 5) : "-", // Extract HH:mm from HH:mm:ss
    },
    {
      title: "Check-out",
      dataIndex: "checkoutTime",
      key: "checkoutTime",
      width: 120,
      render: (time) =>
        time && typeof time === "string" ? time.slice(0, 5) : "-", // Extract HH:mm from HH:mm:ss
    },
    {
      title: "Thời gian làm việc",
      key: "workingTime",
      width: 150,
      render: (_, record) => {
        if (!record.workingTime) return <Text type="secondary">-</Text>;
        const formatted =
          record.workingTime?.formatted ||
          `${record.workingTime?.hours || 0}h ${record.workingTime?.minutes || 0}m`;
        return (
          <Space>
            <Text>{formatted}</Text>
            {record.workingTime?.isOverTenHours && (
              <Tag color="orange">Quá 10h</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => {
        if (record.hasCheckedIn && record.hasCheckedOut) {
          return (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đầy đủ
            </Tag>
          );
        }
        if (record.hasCheckedIn) {
          return <Tag color="blue">Chưa checkout</Tag>;
        }

        // Check if current day is a holiday
        const isHoliday = holidaysData?.some((h) => h.day === day);

        if (isHoliday) {
          return (
            <Tag color="purple" icon={<ClockCircleOutlined />}>
              Nghỉ lễ
            </Tag>
          );
        }

        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Vắng
          </Tag>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (note) => note || "-",
    },
  ];

  // Monthly columns
  const monthlyColumns: ColumnsType<MonthlyAttendanceEmployee> = [
    {
      title: "Mã NV",
      dataIndex: ["employee", "employeeCode"],
      key: "employeeCode",
      width: 100,
      fixed: "left",
    },
    {
      title: "Nhân viên",
      key: "employee",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.employee.fullName}</div>
            <Text type="secondary" className="text-xs">
              {record.employee.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Tỷ lệ chấm công",
      dataIndex: "attendanceRatio",
      key: "attendanceRatio",
      width: 150,
      render: (ratio) => {
        if (ratio == null) return <Tag>N/A</Tag>;
        const percent = (ratio * 100).toFixed(1);
        const color = ratio >= 0.9 ? "green" : ratio >= 0.7 ? "orange" : "red";
        return <Tag color={color}>{percent}%</Tag>;
      },
    },
    {
      title: "Ngày làm việc",
      dataIndex: "actualWorkingDays",
      key: "actualWorkingDays",
      width: 140,
      render: (actual, record) => {
        const expected = record?.expectedWorkingDays ?? 0;
        const actualDays = actual ?? 0;
        const color =
          actualDays >= expected * 0.9
            ? "green"
            : actualDays >= expected * 0.7
              ? "orange"
              : "red";
        return (
          <Space>
            <Tag color={color}>
              {actualDays}/{expected}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Tổng giờ làm",
      key: "totalWorkingTime",
      width: 150,
      render: (_, record) => {
        if (!record.totalWorkingTime) return "-";
        return (
          record.totalWorkingTime?.formatted ||
          `${record.totalWorkingTime?.hours || 0}h ${record.totalWorkingTime?.minutes || 0}m`
        );
      },
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "leaveDays",
      key: "leaveDays",
      width: 100,
      render: (days) => <Tag>{days ?? 0} ngày</Tag>,
    },
    {
      title: "Vắng không phép",
      dataIndex: "daysWithoutCheckInCount",
      key: "daysWithoutCheckInCount",
      width: 150,
      render: (count) =>
        (count ?? 0) > 0 ? (
          <Tag color="red">{count} ngày</Tag>
        ) : (
          <Tag color="green">0</Tag>
        ),
    },
    {
      title: "Làm quá 10h",
      dataIndex: "daysOverTenHoursCount",
      key: "daysOverTenHoursCount",
      width: 120,
      render: (count) => (
        <Tag color={(count ?? 0) > 0 ? "orange" : "default"}>
          {count ?? 0} ngày
        </Tag>
      ),
    },
  ];

  const isLoading = viewMode === "daily" ? isDailyLoading : isMonthlyLoading;
  const dataSource =
    viewMode === "daily"
      ? dailyData?.employees || []
      : monthlyData?.employees || [];
  const columns = viewMode === "daily" ? dailyColumns : monthlyColumns;
  console.log("monthlyData", monthlyData?.employees);
  console.log("dailyData", dailyData);
  // Show error if exists
  if (currentError) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <Text type="danger" className="text-lg">
              Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Quản lý chấm công</Title>
        <Text type="secondary">
          Xem và quản lý báo cáo chấm công theo ngày hoặc theo tháng
        </Text>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Space direction="vertical" size="large" className="w-full">
          <Space size="large" wrap>
            <div>
              <Text strong className="mr-2">
                Chế độ xem:
              </Text>
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="monthly">Theo tháng</Radio.Button>
                <Radio.Button value="daily">Theo ngày</Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <Text strong className="mr-2">
                {viewMode === "daily" ? "Chọn ngày:" : "Chọn tháng:"}
              </Text>
              <DatePicker
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                picker={viewMode === "daily" ? "date" : "month"}
                format={viewMode === "daily" ? "DD/MM/YYYY" : "MM/YYYY"}
                allowClear={false}
              />
            </div>

            {viewMode === "monthly" && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={createReportMutation.isPending}
                onClick={() => createReportMutation.mutate()}
              >
                Tạo báo cáo tháng
              </Button>
            )}
          </Space>
        </Space>
      </Card>

      {/* Statistics */}
      {viewMode === "daily" && dailyData && (
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={dailyData?.totalEmployees ?? 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã check-in"
                value={dailyData?.summary?.employeesWithCheckIn ?? 0}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chưa check-in"
                value={dailyData?.summary?.employeesWithoutCheckIn ?? 0}
                valueStyle={{ color: "#cf1322" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Làm quá 10h"
                value={dailyData?.summary?.employeesOverTenHours ?? 0}
                valueStyle={{ color: "#fa8c16" }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {viewMode === "monthly" && monthlyData && (
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={monthlyData?.totalEmployees ?? 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Ngày làm việc trong tháng"
                value={monthlyData?.employees?.[0]?.expectedWorkingDays ?? 0}
                suffix="ngày"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Table and Calendar */}
      <Row gutter={16}>
        <Col span={viewMode === "monthly" ? 18 : 24}>
          <Card>
            <TableComponent
              columns={columns}
              dataSource={dataSource}
              loading={isLoading}
              rowKey={(record: any) => record.employeeId}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} nhân viên`,
              }}
              hasColumnSettings={false}
            />
          </Card>
        </Col>

        {/* Holiday Calendar - only show in monthly view */}
        {viewMode === "monthly" && (
          <Col span={6}>
            <Card title="Ngày nghỉ lễ trong tháng" className="h-full">
              <Calendar
                fullscreen={false}
                value={selectedDate}
                validRange={[
                  dayjs(new Date(year, month - 1, 1)),
                  dayjs(new Date(year, month, 0)),
                ]}
                cellRender={(current) => {
                  const currentDay = current.date();
                  const currentMonth = current.month() + 1;

                  if (currentMonth !== month) return null;

                  const holiday = holidaysData?.find(
                    (h) => h.day === currentDay,
                  );

                  if (holiday) {
                    return (
                      <Tooltip
                        title={
                          <div>
                            <div className="font-medium">{holiday.name}</div>
                            {holiday.description && (
                              <div className="text-xs mt-1">
                                {holiday.description}
                              </div>
                            )}
                          </div>
                        }
                        placement="top"
                      >
                        <div className="flex justify-center">
                          <Badge status="error" />
                        </div>
                      </Tooltip>
                    );
                  }
                  return null;
                }}
                onSelect={(date) => setSelectedDate(date)}
              />

              {/* Holiday List */}
              <div className="mt-4 space-y-2">
                <Text strong>Danh sách ngày nghỉ:</Text>
                {holidaysData && holidaysData.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {holidaysData.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="p-2 bg-gray-50 rounded border-l-4 border-purple-500"
                      >
                        <div className="font-medium">
                          {holiday.day}/{month}/{year}
                        </div>
                        <div className="text-sm">{holiday.name}</div>
                        {holiday.description && (
                          <div className="text-xs text-gray-500">
                            {holiday.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary" className="text-sm">
                    Không có ngày nghỉ lễ nào trong tháng này
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AttendanceManagementPage;
