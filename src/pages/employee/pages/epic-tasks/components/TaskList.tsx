import { Empty } from "antd";
import { useEpicTask } from "../EpicTaskContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
    const { tasks } = useEpicTask();

    // Filter only root tasks (tasks without parent)
    const rootTasks = tasks.filter(task => !task.parentTaskId);

    if (tasks.length === 0) {
        return (
            <Empty
                description="Chưa có task nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div className="space-y-3">
            {rootTasks.map((task) => (
                <TaskItem key={task.id} task={task} level={0} />
            ))}
        </div>
    );
};

export default TaskList;
