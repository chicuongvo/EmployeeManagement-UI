import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@ant-design/pro-components";
import { Tabs, type TabsProps, Pagination } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import PerformanceCard from "./components/performanceCard.tsx";
import FormFilter from "./components/FormFilter.tsx";
import AddPerformanceDialog from "./components/performanceDialog.tsx";
import { toast } from "sonner";
import type { Performance } from "@/apis/performance/model/Performance.ts"
import { performanceService } from "@/apis/performance/performanceService.ts";

export default function PerformancePage() {
    const navigate = useNavigate();
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [filteredPerformances, setFilteredPerformances] = useState<Performance[]>([]);
    const [filterValues, setFilterValues] = useState<any>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 9;

    // Fetch data from API
    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            setIsLoading(true);
            const data = await performanceService.getAll();
            setPerformances(data);
            setFilteredPerformances(data);
        } catch (error) {
            console.error("Failed to fetch data from backend:", error);
            toast.error("Không thể kết nối với backend API");
            setPerformances([]);
            setFilteredPerformances([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    useEffect(() => {
        let filtered = performances;

        // Apply search filter
        if (filterValues.search) {
            const query = filterValues.search.toLowerCase();
            filtered = filtered.filter((perf) => {
                const monthYear = `${perf.month}/${perf.year}`;
                const id = perf.id.toString();
                return monthYear.includes(query) || id.includes(query);
            });
        }

        setFilteredPerformances(filtered);
        setCurrentPage(1);
    }, [performances, filterValues]);

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Sort performances by year and month (newest first)
    const sortedPerformances = [...filteredPerformances].sort((a, b) => {
        if (b.year !== a.year) {
            return b.year - a.year;
        }
        return b.month - a.month;
    });

    const currentPerformances = sortedPerformances.slice(startIndex, endIndex);

    const handleAddPerformance = async (month: number, year: number) => {
        try {
            const newPerformance = await performanceService.create(month, year);
            setPerformances([newPerformance, ...performances]);
            toast.success("Đã thêm phiếu đánh giá thành công!");
        } catch (error) {
            console.error("Failed to create performance review:", error);
            toast.error("Không thể thêm phiếu đánh giá. Vui lòng thử lại!");
        }
    };

    const handleCardClick = (performance: Performance) => {
        navigate(`/evaluation/performance/${performance.id}`);
    };

    const handleFilterSearch = (values: any) => {
        setFilterValues(values);
    };

    const handleFilterReset = () => {
        setFilterValues({});
    };

    const tabs: TabsProps["items"] = [
        { key: "1", label: "Performance List" },
    ];

    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: "Đánh giá",
                        },
                        {
                            title: "Đánh giá hiệu suất",
                        },
                    ],
                },
            }}
            title={
                <PageTitle title="Performance Management" />
            }
        >
            <Tabs
                type="card"
                activeKey="1"
                className="tag-ticket-list report-tab"
                items={tabs.map((tabItem) => ({
                    key: tabItem.key,
                    children: (
                        <>
                            <FormFilter
                                onSearch={handleFilterSearch}
                                onReset={handleFilterReset}
                                onAddReport={() => setIsDialogOpen(true)}
                                loading={isLoading}
                            />

                            {/* Main Content */}
                            <div className="pb-[100px] mt-8">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-[100px]">
                                        <div className="text-[#718ebf] text-[16px]">Đang tải...</div>
                                    </div>
                                ) : currentPerformances.length === 0 ? (
                                    <div className="flex items-center justify-center py-[100px]">
                                        <div className="text-[#718ebf] text-[16px]">Không tìm thấy phiếu đánh giá nào</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-x-[76px] gap-y-[51px]">
                                        {currentPerformances.map((performance) => (
                                            <div key={performance.id}>
                                                <PerformanceCard
                                                    performance={performance}
                                                    onClick={() => handleCardClick(performance)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {!isLoading && filteredPerformances.length > 0 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        current={currentPage}
                                        total={filteredPerformances.length}
                                        pageSize={itemsPerPage}
                                        onChange={(page) => setCurrentPage(page)}
                                        showSizeChanger={false}
                                        showTotal={(total) => `Total ${total} items`}
                                    />
                                </div>
                            )}

                            {/* Add Dialog */}
                            <AddPerformanceDialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                                onSubmit={handleAddPerformance}
                            />
                        </>
                    ),
                    label: tabItem.label,
                }))}
            />
        </PageContainer>
    );
}
