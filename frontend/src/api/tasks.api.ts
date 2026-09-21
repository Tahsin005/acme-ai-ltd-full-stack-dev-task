import { apiClient } from "./client.js";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task.js";

export const tasksApi = {
  getAll: (): Promise<Task[]> => {
    return apiClient<Task[]>("tasks");
  },

  getById: (id: number): Promise<Task> => {
    return apiClient<Task>(`tasks/${id}`);
  },

  create: (data: CreateTaskInput): Promise<Task> => {
    return apiClient<Task>("tasks", {
      method: "POST",
      body: data,
    });
  },

  update: (id: number, data: UpdateTaskInput): Promise<Task> => {
    return apiClient<Task>(`tasks/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  delete: (id: number): Promise<Task> => {
    return apiClient<Task>(`tasks/${id}`, {
      method: "DELETE",
    });
  },
};
