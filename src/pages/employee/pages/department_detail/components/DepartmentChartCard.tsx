import { Card } from "antd";
import { useState } from "react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
} from "recharts";
import DateRangePicker from "@/components/common/form/DateRangePicker";
import type { Dayjs } from "dayjs";

// Mock data for the chart
const mockChartData = [
    { month: "Jan", employeeCount: 25, performanceScore: 75 },
    { month: "Feb", employeeCount: 28, performanceScore: 78 },
    { month: "Mar", employeeCount: 30, performanceScore: 82 },
    { month: "Apr", employeeCount: 32, performanceScore: 85 },
    { month: "May", employeeCount: 30, performanceScore: 88 },
    { month: "Jun", employeeCount: 30, performanceScore: 90 },
];

const DepartmentChartCard = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
            // TODO: Fetch chart data based on selected date range
            // You can add API call here to fetch data for the selected date range
        } else {
            setDateRange(null);
        }
    };

    return (
        <Card
            className="rounded-xl h-[400px] pt-5"
        >
            {/* Header with Date Range Picker */}
            {/* <div className="flex items-center justify-between mb-4">
                <h3 className="text-[28px] font-bold">Thống kê hiệu suất</h3>
                <DateRangePicker
                    format="DD/MM/YYYY"
                    placeholder={["Từ ngày", "Đến ngày"]}
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ width: 280 }}
                />
            </div> */}

            {/* Chart Area */}
            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                    data={mockChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#d9d9d9" }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#d9d9d9" }}
                        label={{ value: "Số lượng nhân viên", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={{ stroke: "#d9d9d9" }}
                        label={{ value: "Điểm hiệu suất", angle: 90, position: "insideRight", style: { fontSize: 12 } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #d9d9d9",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                        iconType="circle"
                    />

                    {/* Bar Chart - Employee Count */}
                    <Bar
                        yAxisId="left"
                        dataKey="employeeCount"
                        fill="#1890ff"
                        name="Số lượng nhân viên"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                    />

                    {/* Line Chart with Area - Performance Score */}
                    <defs>
                        <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="performanceScore"
                        fill="url(#colorPerformance)"
                        stroke="none"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="performanceScore"
                        stroke="#52c41a"
                        strokeWidth={2}
                        dot={{ fill: "#52c41a", r: 4 }}
                        name="Điểm hiệu suất"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default DepartmentChartCard;
