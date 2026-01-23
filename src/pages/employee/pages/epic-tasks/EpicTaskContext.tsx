import { createContext, useContext, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasksByEpic, type Task } from "@/apis/task";
import { getProjectMembers, type ProjectMember } from "@/apis/project";

interface EpicTaskContextType {
  epicId: number;
  projectId: number;
  tasks: Task[];
  isLoading: boolean;
  refetchTasks: () => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  parentTaskId: number | null;
  setParentTaskId: (id: number | null) => void;
  members: ProjectMember[];
  isLoadingMembers: boolean;
}

const EpicTaskContext = createContext<EpicTaskContextType | undefined>(
  undefined,
);

export const EpicTaskProvider = ({ children }: { children: ReactNode }) => {
  const { epicId, projectId } = useParams<{
    epicId: string;
    projectId: string;
  }>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);

  const {
    data: tasksData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", epicId],
    queryFn: () => getTasksByEpic(Number(epicId)),
    enabled: !!epicId,
  });

  const { data: projectData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(Number(projectId)),
    enabled: !!projectId,
  });

  const value: EpicTaskContextType = {
    epicId: Number(epicId),
    projectId: Number(projectId),
    tasks: tasksData?.data || [],
    isLoading,
    refetchTasks: refetch,
    selectedTask,
    setSelectedTask,
    parentTaskId,
    setParentTaskId,
    members: projectData?.data?.members || [],
    isLoadingMembers,
  };

  return (
    <EpicTaskContext.Provider value={value}>
      {children}
    </EpicTaskContext.Provider>
  );
};

export const useEpicTask = () => {
  const context = useContext(EpicTaskContext);
  if (!context) {
    throw new Error("useEpicTask must be used within EpicTaskProvider");
  }
  return context;
};
