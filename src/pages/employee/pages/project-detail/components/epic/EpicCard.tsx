import { Card, Tag, Avatar, Progress, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { type Epic, EpicPriority } from "@/apis/epic";
import { useProjectDetail } from "../../ProjectDetailContext";

interface EpicCardProps {
    epic: Epic;
}

const EpicCard = ({ epic }: EpicCardProps) => {
    const { setSelectedEpic } = useProjectDetail();

    const getPriorityColor = (priority: EpicPriority) => {
        const colors = {
            [EpicPriority.LOW]: "default",
            [EpicPriority.MEDIUM]: "blue",
            [EpicPriority.HIGH]: "orange",
            [EpicPriority.CRITICAL]: "red",
        };
        return colors[priority];
    };

    const getPriorityLabel = (priority: EpicPriority) => {
        const labels = {
            [EpicPriority.LOW]: "Thấp",
            [EpicPriority.MEDIUM]: "Trung bình",
            [EpicPriority.HIGH]: "Cao",
            [EpicPriority.CRITICAL]: "Khẩn cấp",
        };
        return labels[priority];
    };

    // Mock progress calculation (you can replace with actual task completion data)
    const progress = 0;
    const taskCount = epic._count?.tasks || 0;

    return (
        <Card
            size="small"
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEpic(epic)}
            actions={[
                <EditOutlined key="edit" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEpic(epic);
                }} />,
                <DeleteOutlined key="delete" onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                }} />,
            ]}
        >
            {/* Epic Name */}
            <div className="font-semibold mb-2 line-clamp-2">
                {epic.name}
            </div>

            {/* Priority Badge */}
            <div className="mb-2">
                <Tag color={getPriorityColor(epic.priority)} className="text-xs">
                    {getPriorityLabel(epic.priority)}
                </Tag>
            </div>

            {/* Date Range */}
            {(epic.startDate || epic.endDate) && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <CalendarOutlined />
                    <span>
                        {epic.startDate ? dayjs(epic.startDate).format("DD/MM/YYYY") : "..."}
                        {" - "}
                        {epic.endDate ? dayjs(epic.endDate).format("DD/MM/YYYY") : "..."}
                    </span>
                </div>
            )}

            {/* Executors */}
            {epic.executors && epic.executors.length > 0 && (
                <div className="mb-2">
                    <Avatar.Group maxCount={3} size="small">
                        {epic.executors.map((executor) => (
                            <Tooltip key={executor.id} title={executor.employee.fullName}>
                                <Avatar
                                    src={executor.employee.avatar}
                                    style={{ backgroundColor: "#1890ff" }}
                                >
                                    {executor.employee.fullName.charAt(0)}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                </div>
            )}

            {/* Task Count & Progress */}
            <div className="text-xs text-gray-500 mb-1">
                {taskCount} tasks
            </div>
            <Progress percent={progress} size="small" showInfo={false} />
        </Card>
    );
};

export default EpicCard;
