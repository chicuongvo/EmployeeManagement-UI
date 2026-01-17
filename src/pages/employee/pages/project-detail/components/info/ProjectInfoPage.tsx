import { Card, Descriptions, Tag, Button, Space } from "antd";
import { EditOutlined, CalendarOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useProjectDetail } from "../../ProjectDetailContext";
import { ProjectStatus } from "@/apis/project";
import FormEditProject from "./FormEditProject";

const ProjectInfoPage = () => {
    const { projectData } = useProjectDetail();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const project = projectData?.data;

    const getStatusColor = (status: ProjectStatus): string => {
        const statusColors: Record<ProjectStatus, string> = {
            PLANNING: "blue",
            IN_PROGRESS: "cyan",
            ON_HOLD: "orange",
            COMPLETED: "green",
            CANCELLED: "red",
        };
        return statusColors[status] || "default";
    };

    const getStatusLabel = (status: ProjectStatus): string => {
        const statusLabels: Record<ProjectStatus, string> = {
            PLANNING: "Đang lập kế hoạch",
            IN_PROGRESS: "Đang thực hiện",
            ON_HOLD: "Tạm dừng",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy",
        };
        return statusLabels[status] || status;
    };

    if (!project) {
        return <div>Đang tải...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                    Thông tin dự án
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Chỉnh sửa
                </Button>
            </div>

            {/* Project Information Card */}
            <Card>
                <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                    labelStyle={{ fontWeight: 600, width: '200px' }}
                >
                    <Descriptions.Item label="Tên dự án" span={2}>
                        <span className="text-lg font-semibold">{project.name}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả" span={2}>
                        {project.description || <span className="text-gray-400">Chưa có mô tả</span>}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(project.status)}>
                            {getStatusLabel(project.status)}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngân sách">
                        <Space>
                            <DollarOutlined />
                            {project.budget
                                ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(Number(project.budget))
                                : <span className="text-gray-400">Chưa xác định</span>
                            }
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày bắt đầu">
                        <Space>
                            <CalendarOutlined />
                            {project.startDate
                                ? dayjs(project.startDate).format("DD/MM/YYYY")
                                : <span className="text-gray-400">Chưa xác định</span>
                            }
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày kết thúc">
                        <Space>
                            <CalendarOutlined />
                            {project.endDate
                                ? dayjs(project.endDate).format("DD/MM/YYYY")
                                : <span className="text-gray-400">Chưa xác định</span>
                            }
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Người quản lý">
                        <Space>
                            <UserOutlined />
                            {project.manager ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{project.manager.fullName}</span>
                                    <span className="text-gray-500 text-sm">({project.manager.email})</span>
                                </div>
                            ) : (
                                <span className="text-gray-400">Chưa có</span>
                            )}
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Số thành viên">
                        <Space>
                            <UserOutlined />
                            <span className="font-semibold">{project.members?.length || 0}</span> thành viên
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {dayjs(project.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>

                    <Descriptions.Item label="Cập nhật lần cuối">
                        {dayjs(project.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Edit Project Modal */}
            <FormEditProject
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                project={project}
            />
        </div>
    );
};

export default ProjectInfoPage;
