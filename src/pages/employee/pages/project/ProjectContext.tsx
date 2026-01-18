import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import useGetParam from "@/hooks/useGetParam";
import { getListProject } from "@/apis/project/getListProject";
import type {
  Project,
  GetListProjectRequest,
  GetListProjectResponse,
} from "@/apis/project/model/Project";

interface ProjectContextType {
  params: GetListProjectRequest;
  paramsStr: string;
  refetch: () => void;
  dataResponse?: GetListProjectResponse;
  isLoading: boolean;
  isSuccess: boolean;
  handleFilterSubmit: (values: GetListProjectRequest) => void;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  selectedProject: Project | null;
  tab?: string;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [, setSearchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const generalCode = useGetParam<string>("general_code", "string");
  const generalCodeType = useGetParam<string>(
    "general_code_type",
    "string",
    "q",
  );
  const page = useGetParam<number>("page", "number");
  const limit = useGetParam<number>("limit", "number");
  const sort = useGetParam<string>("sort", "string");
  const tab = useGetParam<string>("tab");

  // Date range filters
  const createdDateFrom = useGetParam<number>("created_date_from", "number");
  const createdDateTo = useGetParam<number>("created_date_to", "number");
  const updatedDateFrom = useGetParam<number>("updated_date_from", "number");
  const updatedDateTo = useGetParam<number>("updated_date_to", "number");
  const startDateFrom = useGetParam<number>("start_date_from", "number");
  const startDateTo = useGetParam<number>("start_date_to", "number");
  const endDateFrom = useGetParam<number>("end_date_from", "number");
  const endDateTo = useGetParam<number>("end_date_to", "number");

  const name = useGetParam<string>("name", "string");
  const status = useGetParam<string>("status", "string");
  const managerId = useGetParam<number>("managerId", "number");
  
  const params = useMemo((): GetListProjectRequest => {
    return {
      name,
      status: status as any,
      managerId,
      page,
      limit,
      sort,
      created_date_from: createdDateFrom,
      created_date_to: createdDateTo,
      updated_date_from: updatedDateFrom,
      updated_date_to: updatedDateTo,
      start_date_from: startDateFrom,
      start_date_to: startDateTo,
      end_date_from: endDateFrom,
      end_date_to: endDateTo,
      general_code: generalCode,
      general_code_type: generalCodeType,
    };
  }, [
    name,
    status,
    managerId,
    page,
    limit,
    sort,
    createdDateFrom,
    createdDateTo,
    updatedDateFrom,
    updatedDateTo,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    generalCode,
    generalCodeType,
  ]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const { isLoading, data, refetch, isSuccess } = useQuery({
    queryKey: ["projects", params, tab],
    queryFn: (): Promise<GetListProjectResponse> => {
      const modifiedParams = {
        ...params,
        [`${params.general_code_type ?? ""}`]: params.general_code
          ? params.general_code.trim()
          : undefined,
      };

      modifiedParams.general_code = undefined;
      modifiedParams.general_code_type = undefined;
      return getListProject(modifiedParams);
    },
    enabled: !!tab,
  });

  const handleFilterSubmit = (values: GetListProjectRequest) => {
    setSearchParams(
      queryString.stringify(
        {
          ...values,
          tab: tab ?? 1,
        },
        { arrayFormat: "comma" },
      ),
    );
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams(
        queryString.stringify({
          tab: 1,
          page: 1,
          limit: 10,
        }),
      );
    }
  }, [setSearchParams, tab]);

  return (
    <ProjectContext.Provider
      value={{
        params,
        paramsStr,
        refetch,
        dataResponse: data,
        isLoading: isLoading,
        isSuccess,
        handleFilterSubmit,
        setSelectedProject,
        selectedProject,
        tab,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within an ProjectProvider");
  }
  return context;
};
