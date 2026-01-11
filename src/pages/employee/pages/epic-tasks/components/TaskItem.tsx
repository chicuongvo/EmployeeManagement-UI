import { useState } from "react";
import { Card, Tag, Avatar, Tooltip, Button, Checkbox, Badge, Spin } from "antd";
import {
    RightOutlined,
    DownOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    PlusOutlined,
    FileTextOutlined,
    FolderOutlined,
    FolderOpenOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { type Task, TaskPriority, TaskStatus, getTaskById } from "@/apis/task";
import { useEpicTask } from "../EpicTaskContext";

interface TaskItemProps {
    task: Task;
    level: number;
}

const TaskItem = ({ task, level }: TaskItemProps) => {
    const { setSelectedTask, setParentTaskId } = useEpicTask();
    const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed

    // Lazy-load subtasks when expanded
    const { data: taskDetailResponse, isLoading: isLoadingSubtasks } = useQuery({
        queryKey: ["task", task.id],
        queryFn: () => getTaskById(task.id)(), // Call the function that returns the promise
    });
    // Get subtasks from the fetched task detail
    const subtasks = taskDetailResponse?.data?.subtasks || [];
    const hasSubtasks = (task.subtasks && task.subtasks.length > 0) || subtasks.length > 0;
    const getStatusColor = (status: TaskStatus) => {
        const colors = {
            [TaskStatus.TODO]: "blue",
            [TaskStatus.IN_PROGRESS]: "cyan",
            [TaskStatus.IN_REVIEW]: "purple",
            [TaskStatus.DONE]: "green",
            [TaskStatus.CANCELLED]: "red",
        };
        return colors[status];
    };

    const getStatusLabel = (status: TaskStatus) => {
        const labels = {
            [TaskStatus.TODO]: "Cần làm",
            [TaskStatus.IN_PROGRESS]: "Đang làm",
            [TaskStatus.IN_REVIEW]: "Review",
            [TaskStatus.DONE]: "Hoàn thành",
            [TaskStatus.CANCELLED]: "Đã hủy",
        };
        return labels[status];
    };

    const getPriorityColor = (priority: TaskPriority) => {
        const colors = {
            [TaskPriority.LOW]: "default",
            [TaskPriority.MEDIUM]: "blue",
            [TaskPriority.HIGH]: "orange",
            [TaskPriority.CRITICAL]: "red",
        };
        return colors[priority];
    };

    const getPriorityLabel = (priority: TaskPriority) => {
        const labels = {
            [TaskPriority.LOW]: "Thấp",
            [TaskPriority.MEDIUM]: "Trung bình",
            [TaskPriority.HIGH]: "Cao",
            [TaskPriority.CRITICAL]: "Khẩn cấp",
        };
        return labels[priority];
    };

    // Background color based on nesting level
    const getBackgroundColor = () => {
        if (level === 0) return "#FFFFFF";
        if (level === 1) return "#F5F5F5";
        return "#FAFAFA";
    };

    const handleAddSubtask = () => {
        // Set the parent task ID and open the modal
        setParentTaskId(task.id);
        setSelectedTask(null); // Clear selected task to create new
    };

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const isCompleted = task.status === TaskStatus.DONE;

    return (
        <div style={{ marginLeft: level * 40, position: "relative" }}>
            {/* Connecting line for nested tasks */}
            {level > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: -20,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: "#1890ff",
                        opacity: 0.3,
                    }}
                />
            )}

            <Card
                size="small"
                className="hover:shadow-md transition-all mb-2"
                style={{
                    backgroundColor: getBackgroundColor(),
                    borderLeft: level > 0 ? "3px solid #1890ff" : undefined,
                }}
            >
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <Checkbox
                        checked={isCompleted}
                        onChange={() => {
                            // Handle status toggle
                        }}
                    />

                    {/* Expand/Collapse button or icon */}
                    <div style={{ width: 24, display: "flex", alignItems: "center" }}>
                        {hasSubtasks ? (
                            <Button
                                type="text"
                                size="small"
                                icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
                                onClick={handleToggleExpand}
                                style={{ padding: 0 }}
                            />
                        ) : (
                            <FileTextOutlined style={{ color: "#999", fontSize: 16 }} />
                        )}
                    </div>

                    {/* Folder icon for tasks with subtasks */}
                    {hasSubtasks && (
                        <div style={{ width: 20 }}>
                            {isExpanded ? (
                                <FolderOpenOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                            ) : (
                                <FolderOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                            )}
                        </div>
                    )}

                    {/* Task content */}
                    <div className="flex-1">
                        {/* Task name and badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                                className={`font-semibold ${isCompleted ? "line-through text-gray-400" : ""}`}
                                style={{ fontSize: level === 0 ? 16 : 14 }}
                            >
                                {task.name}
                            </span>

                            {/* Subtask count badge - only show when collapsed */}
                            {hasSubtasks && !isExpanded && (
                                <Badge
                                    count={`${subtasks.length} subtask${subtasks.length > 1 ? 's' : ''}`}
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        color: '#666',
                                        fontSize: 11,
                                        height: 20,
                                        lineHeight: '20px',
                                    }}
                                />
                            )}

                            <Tag color={getStatusColor(task.status)} className="text-xs">
                                {getStatusLabel(task.status)}
                            </Tag>
                            <Tag color={getPriorityColor(task.priority)} className="text-xs">
                                {getPriorityLabel(task.priority)}
                            </Tag>
                        </div>

                        {/* Task meta info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            {/* Due date */}
                            {task.dueDate && (
                                <div className="flex items-center gap-1">
                                    <CalendarOutlined />
                                    <span>{dayjs(task.dueDate).format("DD/MM/YYYY")}</span>
                                </div>
                            )}

                            {/* Assignees */}
                            {task.assignments && task.assignments.length > 0 && (
                                <Avatar.Group maxCount={level === 0 ? 3 : 2} size="small">
                                    {task.assignments.map((assignment) => (
                                        <Tooltip key={assignment.id} title={assignment.employee.fullName}>
                                            <Avatar
                                                src={assignment.employee.avatar}
                                                style={{ backgroundColor: "#1890ff" }}
                                            >
                                                {assignment.employee.fullName.charAt(0)}
                                            </Avatar>
                                        </Tooltip>
                                    ))}
                                </Avatar.Group>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                        {/* Add Subtask button - size adapts to level */}
                        {level < 2 ? (
                            <Button
                                type="default"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={handleAddSubtask}
                            >
                                Công việc con
                            </Button>
                        ) : (
                            <Tooltip title="Thêm công việc con">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddSubtask}
                                />
                            </Tooltip>
                        )}

                        {/* Edit button */}
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => setSelectedTask(task)}
                            />
                        </Tooltip>

                        {/* Delete button */}
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    // Handle delete
                                }}
                            />
                        </Tooltip>
                    </div>
                </div>
            </Card>

            {/* Render subtasks recursively - ONLY when expanded */}
            {hasSubtasks && isExpanded && (
                <div className="mt-1" style={{
                    animation: 'slideDown 0.2s ease-out',
                }}>
                    {isLoadingSubtasks ? (
                        <div className="flex justify-center py-4">
                            <Spin size="small" />
                        </div>
                    ) : (
                        subtasks.map((subtask: Task) => (
                            <TaskItem key={subtask.id} task={subtask} level={level + 1} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskItem;
