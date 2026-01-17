import { createContext, useContext, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListEpic, type Epic } from "@/apis/epic";

interface ProjectDetailContextType {
    projectId: number;
    epics: Epic[];
    isLoading: boolean;
    refetchEpics: () => void;
    selectedEpic: Epic | null;
    setSelectedEpic: (epic: Epic | null) => void;
}

const ProjectDetailContext = createContext<ProjectDetailContextType | undefined>(undefined);

export const ProjectDetailProvider = ({ children }: { children: ReactNode }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

    const { data: epicsData, isLoading, refetch } = useQuery({
        queryKey: ["epics", projectId],
        queryFn: () => getListEpic(Number(projectId)),
        enabled: !!projectId,
    });

    const value: ProjectDetailContextType = {
        projectId: Number(projectId),
        epics: epicsData?.data || [],
        isLoading,
        refetchEpics: refetch,
        selectedEpic,
        setSelectedEpic,
    };

    return (
        <ProjectDetailContext.Provider value={value}>
            {children}
        </ProjectDetailContext.Provider>
    );
};

export const useProjectDetail = () => {
    const context = useContext(ProjectDetailContext);
    if (!context) {
        throw new Error("useProjectDetail must be used within ProjectDetailProvider");
    }
    return context;
};
