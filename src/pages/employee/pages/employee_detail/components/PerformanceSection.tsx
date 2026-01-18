import { Card } from "antd";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
} from "recharts";
import React, { useMemo } from "react";

const PerformanceSection = () => {
    // Mock performance data - replace with real API data when available
    const mockPerformanceData = useMemo(() => [
        { criteria: "Tiêu chí 1", value: 85 },
        { criteria: "Tiêu chí 2", value: 75 },
        { criteria: "Tiêu chí 3", value: 90 },
        { criteria: "Tiêu chí 4", value: 70 },
        { criteria: "Tiêu chí 5", value: 80 },
        { criteria: "Tiêu chí 6", value: 88 },
    ], []);

    const currentMonth = useMemo(() => {
        const now = new Date();
        return `${now.getMonth() + 1}/${now.getFullYear()}`;
    }, []);

    return (
        <Card className="rounded-2xl shadow-md" bodyStyle={{ padding: "20px" }}>
            {/* Performance Section */}
            <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4">
                    Hệ số hiệu suất - Tháng {currentMonth}
                </h4>
                <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={mockPerformanceData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis
                                dataKey="criteria"
                                tick={{ fill: "#6b7280", fontSize: 11 }}
                            />
                            <Radar
                                name="Performance"
                                dataKey="value"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.25}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default React.memo(PerformanceSection);