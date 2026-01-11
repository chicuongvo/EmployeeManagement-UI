import { useState, useEffect } from "react";
import { Button, Empty, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProjectDetail } from "../../ProjectDetailContext";
import { EpicStatus, type Epic } from "@/apis/epic";
import EpicCard from "./EpicCard";
import FormCreateEpic from "./FormCreateEpic";

const EpicKanbanBoard = () => {
    const { epics, isLoading, selectedEpic, setSelectedEpic } = useProjectDetail();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open modal when selectedEpic is set (for editing)
    useEffect(() => {
        if (selectedEpic) {
            setIsModalOpen(true);
        }
    }, [selectedEpic]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEpic(null);
    };

    const columns = [
        { status: EpicStatus.TODO, title: "Cần làm", color: "#1890ff" },
        { status: EpicStatus.IN_PROGRESS, title: "Đang thực hiện", color: "#13c2c2" },
        { status: EpicStatus.DONE, title: "Hoàn thành", color: "#52c41a" },
        { status: EpicStatus.CANCELLED, title: "Đã hủy", color: "#ff4d4f" },
    ];

    const getEpicsByStatus = (status: EpicStatus): Epic[] => {
        return epics.filter((epic) => epic.status === status);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Quản lý Epic ({epics.length})
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Tạo Epic Mới
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => {
                    const columnEpics = getEpicsByStatus(column.status);
                    return (
                        <div
                            key={column.status}
                            className="bg-gray-50 rounded-lg p-4"
                            style={{ minHeight: "500px" }}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: column.color }}
                                    />
                                    <span className="font-semibold">{column.title}</span>
                                </div>
                                <span className="text-gray-500 text-sm">
                                    {columnEpics.length}
                                </span>
                            </div>

                            {/* Epic Cards */}
                            <div className="space-y-3">
                                {columnEpics.length === 0 ? (
                                    <Empty
                                        description="Không có epic"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ) : (
                                    columnEpics.map((epic) => (
                                        <EpicCard key={epic.id} epic={epic} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create/Edit Epic Modal */}
            <FormCreateEpic
                open={isModalOpen}
                onCancel={handleCloseModal}
            />
        </div>
    );
};

export default EpicKanbanBoard;
