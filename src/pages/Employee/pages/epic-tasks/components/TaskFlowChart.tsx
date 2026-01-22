import { useMemo, useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import type { Task } from "@/apis/task";
import { getTaskById } from "@/apis/task";
import { Card, Empty, Badge, Tag, Spin } from "antd";
import TaskCommentsModal from "./TaskCommentsModal";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface TaskFlowChartProps {
  tasks: Task[];
}

const statusColors = {
  TODO: "#d9d9d9",
  IN_PROGRESS: "#1890ff",
  IN_REVIEW: "#722ed1",
  DONE: "#52c41a",
  CANCELLED: "#ff4d4f",
};

const statusIcons = {
  TODO: <ClockCircleOutlined />,
  IN_PROGRESS: <SyncOutlined spin />,
  IN_REVIEW: <ExclamationCircleOutlined />,
  DONE: <CheckCircleOutlined />,
  CANCELLED: <ExclamationCircleOutlined />,
};

const priorityColors = {
  LOW: "#52c41a",
  MEDIUM: "#faad14",
  HIGH: "#ff7a45",
  CRITICAL: "#ff4d4f",
};

const TaskFlowChart = ({ tasks }: TaskFlowChartProps) => {
  console.log("TaskFlowChart received tasks:", tasks);
  console.log("Tasks length:", tasks.length);

  const [allFetchedTasks, setAllFetchedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  // Get current user ID from localStorage (from JWT token)
  const getCurrentUserId = (): number => {
    const token = localStorage.getItem("accessToken");
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || 0;
    } catch {
      return 0;
    }
  };

  // Fetch all subtasks recursively via API
  const fetchSubtasksRecursively = useCallback(
    async (task: Task): Promise<Task[]> => {
      const result: Task[] = [task];

      console.log("Fetching subtasks for task:", task);
      // If task has subtasks in the response, fetch details for each
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          try {
            // Fetch full task details to get nested subtasks
            const response = await getTaskById(subtask.id)();
            if (response.data) {
              const nestedSubtasks = await fetchSubtasksRecursively(
                response.data,
              );
              console.log(nestedSubtasks, "###");
              result.push(...nestedSubtasks);
            }
          } catch (error) {
            console.error(`Error fetching subtask ${subtask.id}:`, error);
            // Still add the subtask even if fetch fails
            result.push(subtask);
          }
        }
      }
      console.log(result, "###");
      return result;
    },
    [],
  );

  // Fetch all tasks with their nested subtasks
  useEffect(() => {
    const fetchAllTasks = async () => {
      setIsLoading(true);
      try {
        const allTasks: Task[] = [];

        for (const task of tasks) {
          const tasksWithSubtasks = await fetchSubtasksRecursively(task);
          allTasks.push(...tasksWithSubtasks);
        }

        setAllFetchedTasks(allTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setAllFetchedTasks(tasks); // Fallback to original tasks
      } finally {
        setIsLoading(false);
      }
    };

    if (tasks.length > 0) {
      fetchAllTasks();
    } else {
      setAllFetchedTasks([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // Calculate depth for each task based on parentTaskId
  const tasksWithDepth = useMemo(() => {
    const taskMap = new Map(allFetchedTasks.map((t) => [t.id, t]));

    const calculateDepth = (task: Task): number => {
      if (!task.parentTaskId) return 0;
      const parent = taskMap.get(task.parentTaskId);
      return parent ? calculateDepth(parent) + 1 : 0;
    };

    return allFetchedTasks.map((task) => ({
      ...task,
      depth: calculateDepth(task),
    }));
  }, [allFetchedTasks]);

  // Convert tasks to React Flow nodes
  console.log("tasksWithDepth:", tasksWithDepth);
  console.log("tasksWithDepth length:", tasksWithDepth.length);

  const initialNodes: Node[] = useMemo(() => {
    console.log("Creating nodes from tasksWithDepth:", tasksWithDepth);
    return tasksWithDepth.map((task, index) => {
      const indentPrefix = "  ".repeat(task.depth);

      return {
        id: task.id.toString(),
        type: "default",
        position: {
          x: task.depth * 350,
          y: index * 180,
        },
        data: {
          label: (
            <div className="p-2.5 w-[240px]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-semibold text-xs flex-1 line-clamp-2">
                  {indentPrefix}
                  {task.depth > 0 && "↳ "}
                  {task.name}
                </div>
                <Badge
                  style={{
                    backgroundColor: "#1890ff",
                    fontSize: "10px",
                  }}
                  showZero={false}
                />
              </div>

              <div className="flex gap-1 mb-2 flex-wrap">
                <Tag
                  icon={statusIcons[task.status]}
                  color={statusColors[task.status]}
                  className="text-xs"
                >
                  {task.status.replace("_", " ")}
                </Tag>
                <Tag color={priorityColors[task.priority]} className="text-xs">
                  {task.priority}
                </Tag>
              </div>

              {task.startDate && task.dueDate && (
                <div className="text-xs text-gray-500 space-y-1">
                  <div>🗓️ {dayjs(task.startDate).format("DD/MM/YYYY")}</div>
                  <div>⏰ {dayjs(task.dueDate).format("DD/MM/YYYY")}</div>
                </div>
              )}

              {task.assignments && task.assignments.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  👥 {task.assignments.length} assignee
                  {task.assignments.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: "#fff",
          border: `2px solid ${priorityColors[task.priority]}`,
          borderRadius: "8px",
          padding: 0,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [tasksWithDepth]);

  // Convert parent-child relationships to edges
  const initialEdges: Edge[] = useMemo(() => {
    return tasksWithDepth
      .filter((task) => task.parentTaskId)
      .map((task) => ({
        id: `e-${task.parentTaskId}-${task.id}`,
        source: task.parentTaskId!.toString(),
        target: task.id.toString(),
        type: "smoothstep",
        animated: task.status === "IN_PROGRESS",
        style: {
          stroke: statusColors[task.status],
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: statusColors[task.status],
        },
      }));
  }, [tasksWithDepth]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when initialNodes/initialEdges change
  useEffect(() => {
    console.log("Updating nodes with initialNodes:", initialNodes);
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    console.log("Updating edges with initialEdges:", initialEdges);
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Handle node click - must be before any early returns
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const task = tasksWithDepth.find((t) => t.id.toString() === node.id);
      if (task) {
        setSelectedTask(task);
        setCommentsModalOpen(true);
      }
    },
    [tasksWithDepth],
  );

  console.log("Nodes:", nodes);
  console.log("Edges:", edges);
  console.log("isLoading:", isLoading);

  if (isLoading) {
    console.log("Rendering loading spinner");
    return (
      <Card title="Task Dependency Flow">
        <div className="flex items-center justify-center h-[600px]">
          <Spin size="large" tip="Đang tải tasks..." />
        </div>
      </Card>
    );
  }

  if (tasksWithDepth.length === 0) {
    console.log("No tasks, rendering empty state");
    return (
      <Card>
        <Empty
          description="Chưa có task nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  console.log("Rendering ReactFlow with nodes and edges");
  return (
    <>
      <Card title="Task Dependency Flow">
        <div style={{ width: "100%", height: "600px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-left"
          >
            <Background color="#f0f0f0" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const task = tasksWithDepth.find(
                  (t) => t.id.toString() === node.id,
                );
                return task ? priorityColors[task.priority] : "#e0e0e0";
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
      </Card>
      <TaskCommentsModal
        task={selectedTask}
        open={commentsModalOpen}
        onClose={() => {
          setCommentsModalOpen(false);
          setSelectedTask(null);
        }}
        currentUserId={getCurrentUserId()}
      />{" "}
    </>
  );
};

export default TaskFlowChart;
