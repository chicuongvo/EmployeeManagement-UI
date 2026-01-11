import { createContext, useContext, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasksByEpic, type Task } from "@/apis/task";

interface EpicTaskContextType {
    epicId: number;
    tasks: Task[];
    isLoading: boolean;
    refetchTasks: () => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    parentTaskId: number | null;
    setParentTaskId: (id: number | null) => void;
}

const EpicTaskContext = createContext<EpicTaskContextType | undefined>(undefined);

export const EpicTaskProvider = ({ children }: { children: ReactNode }) => {
    const { epicId } = useParams<{ epicId: string }>();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [parentTaskId, setParentTaskId] = useState<number | null>(null);

    const { data: tasksData, isLoading, refetch } = useQuery({
        queryKey: ["tasks", epicId],
        queryFn: () => getTasksByEpic(Number(epicId)),
        enabled: !!epicId,
    });

    const value: EpicTaskContextType = {
        epicId: Number(epicId),
        tasks: tasksData?.data || [],
        isLoading,
        refetchTasks: refetch,
        selectedTask,
        setSelectedTask,
        parentTaskId,
        setParentTaskId,
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
