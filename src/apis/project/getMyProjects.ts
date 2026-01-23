import requestApi from "@/utils/requestApi";
import type { GetListProjectResponse } from "./model/Project";

const endpoints = {
  myProjects: "/projects/my-projects",
};

const getMyProjects = async (): Promise<GetListProjectResponse> => {
  return requestApi.get<GetListProjectResponse>(endpoints.myProjects);
};

export { getMyProjects };
