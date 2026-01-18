import type { Performance } from "@/apis/performance/model/Performance";
import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

interface PerformanceCardProps {
    performance: Performance;
    onClick?: () => void;
}

const MONTH_NAMES = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

export default function PerformanceCard({ performance, onClick }: PerformanceCardProps) {
    const monthName = MONTH_NAMES[performance.month - 1] || `Tháng ${performance.month}`;
    const createdAt = performance.createdAt ? new Date(performance.createdAt) : null;
    const formattedDate = createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString("vi-VN")
        : "-";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={handleKeyDown}
            className="group relative w-full h-[230px] rounded-[20px] bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col p-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <div className="shrink-0 h-[60px] w-[60px] rounded-[16px] bg-gradient-to-br from-[#2d60ff] to-[#1e40af] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FileTextOutlined className="text-white text-[28px]" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-[#343C6A] font-semibold text-[10px] uppercase tracking-wide mb-1 opacity-70">
                            Phiếu đánh giá
                        </div>
                        <div className="text-[#2d60ff] font-bold text-[20px] leading-tight truncate">
                            {monthName}/{performance.year}
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer Section */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-[#718ebf] text-[13px]">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <CalendarOutlined className="text-[#2d60ff] text-[14px]" />
                        </div>
                        <span className="font-medium">Ngày tạo: <span className="text-[#343C6A]">{formattedDate}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
