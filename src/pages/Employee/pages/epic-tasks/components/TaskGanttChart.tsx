import { useMemo, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import type { Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import type { Task } from "@/apis/task";
import dayjs from "dayjs";
import { Card, Empty, Select, Segmented } from "antd";
import { PartitionOutlined, BarsOutlined } from "@ant-design/icons";
import TaskFlowChart from "./TaskFlowChart";

interface TaskGanttChartProps {
  tasks: Task[];
}

type ViewType = "gantt" | "flow";

const TaskGanttChart = ({ tasks }: TaskGanttChartProps) => {
  const [viewType, setViewType] = useState<ViewType>("flow");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

  const ganttTasks = useMemo<GanttTask[]>(() => {
    // Flatten all tasks including subtasks
    const flattenTasks = (taskList: Task[]): Task[] => {
      const result: Task[] = [];
      taskList.forEach((task) => {
        result.push(task);
        if (task.subtasks && task.subtasks.length > 0) {
          result.push(...flattenTasks(task.subtasks));
        }
      });
      return result;
    };

    const allTasks = flattenTasks(tasks);

    // Filter tasks that have both start and due dates
    const tasksWithDates = allTasks.filter(
      (task) => task.startDate && task.dueDate,
    );

    if (tasksWithDates.length === 0) {
      return [];
    }

    return tasksWithDates.map((task) => {
      const start = dayjs(task.startDate).toDate();
      const end = dayjs(task.dueDate).toDate();

      // Ensure end is after start
      const validEnd = dayjs(end).isAfter(start)
        ? end
        : dayjs(start).add(1, "day").toDate();

      // Determine if this task has subtasks with dates
      const hasSubtasksWithDates = task.subtasks?.some(
        (subtask) => subtask.startDate && subtask.dueDate,
      );

      return {
        id: task.id.toString(),
        name: task.parentTaskId
          ? `  ↳ ${task.name}` // Indent subtask names
          : task.name,
        start,
        end: validEnd,
        progress:
          task.status === "DONE"
            ? 100
            : task.status === "IN_PROGRESS"
              ? 50
              : task.status === "IN_REVIEW"
                ? 75
                : 0,
        type: hasSubtasksWithDates ? "project" : "task",
        dependencies: task.parentTaskId ? [task.parentTaskId.toString()] : [],
        project: task.parentTaskId ? task.parentTaskId.toString() : undefined,
        styles: {
          backgroundColor:
            task.priority === "CRITICAL"
              ? "#ff4d4f"
              : task.priority === "HIGH"
                ? "#ff7a45"
                : task.priority === "MEDIUM"
                  ? "#ffa940"
                  : "#52c41a",
          progressColor:
            task.priority === "CRITICAL"
              ? "#cf1322"
              : task.priority === "HIGH"
                ? "#d4380d"
                : task.priority === "MEDIUM"
                  ? "#d46b08"
                  : "#389e0d",
          backgroundSelectedColor:
            task.priority === "CRITICAL"
              ? "#ff7875"
              : task.priority === "HIGH"
                ? "#ff9c6e"
                : task.priority === "MEDIUM"
                  ? "#ffc069"
                  : "#73d13d",
        },
      } as GanttTask;
    });
  }, [tasks]);

  if (ganttTasks.length === 0 && viewType === "gantt") {
    return (
      <Card>
        <Empty
          description="Chưa có task nào có ngày bắt đầu và hạn hoàn thành"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // If flow view, render the flow chart
  if (viewType === "flow") {
    return <TaskFlowChart tasks={tasks} />;
  }

  return (
    <Card
      title="Timeline Tasks"
      extra={
        <div className="flex gap-2">
          <Segmented
            value={viewType}
            onChange={(value) => setViewType(value as ViewType)}
            options={[
              {
                label: "Flow Chart",
                value: "flow",
                icon: <PartitionOutlined />,
              },
              {
                label: "Gantt Chart",
                value: "gantt",
                icon: <BarsOutlined />,
              },
            ]}
          />
          {viewType === "gantt" && (
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: 120 }}
              options={[
                { label: "Giờ", value: ViewMode.Hour },
                { label: "Ngày", value: ViewMode.Day },
                { label: "Tuần", value: ViewMode.Week },
                { label: "Tháng", value: ViewMode.Month },
              ]}
            />
          )}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <Gantt
          tasks={ganttTasks}
          viewMode={viewMode}
          locale="vi"
          listCellWidth="155px"
          columnWidth={viewMode === ViewMode.Month ? 300 : 65}
        />
      </div>
    </Card>
  );
};

export default TaskGanttChart;
