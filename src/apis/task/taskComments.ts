import requestApi from "@/utils/requestApi";

export interface TaskComment {
  id: number;
  taskId: number;
  employeeId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  employee: {
    id: number;
    fullName: string;
    avatar?: string;
    employeeCode: string;
  };
}

export interface GetTaskCommentsResponse {
  success: boolean;
  data: TaskComment[];
  message?: string;
}

export interface CreateTaskCommentRequest {
  content: string;
}

export interface CreateTaskCommentResponse {
  success: boolean;
  data: TaskComment;
  message?: string;
}

export interface UpdateTaskCommentRequest {
  content: string;
}

export interface UpdateTaskCommentResponse {
  success: boolean;
  data: TaskComment;
  message?: string;
}

export interface DeleteTaskCommentResponse {
  success: boolean;
  data: { message: string };
  message?: string;
}

// Get all comments for a task
export const getTaskComments = async (
  taskId: number,
): Promise<GetTaskCommentsResponse> => {
  return requestApi.get<GetTaskCommentsResponse>(`/tasks/${taskId}/comments`);
};

// Create a new comment
export const createTaskComment = async (
  taskId: number,
  data: CreateTaskCommentRequest,
): Promise<CreateTaskCommentResponse> => {
  return requestApi.post<CreateTaskCommentResponse>(
    `/tasks/${taskId}/comments`,
    data,
  );
};

// Update a comment
export const updateTaskComment = async (
  commentId: number,
  data: UpdateTaskCommentRequest,
): Promise<UpdateTaskCommentResponse> => {
  return requestApi.put<UpdateTaskCommentResponse>(
    `/comments/${commentId}`,
    data,
  );
};

// Delete a comment
export const deleteTaskComment = async (
  commentId: number,
): Promise<DeleteTaskCommentResponse> => {
  return requestApi.delete<DeleteTaskCommentResponse>(`/comments/${commentId}`);
};
