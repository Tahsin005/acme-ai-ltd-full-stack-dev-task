export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorIssue {
  code?: string;
  message: string;
  path?: (string | number)[];
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ErrorIssue[];
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
