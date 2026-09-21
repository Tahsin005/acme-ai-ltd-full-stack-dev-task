import { create } from "zustand";
import type { Task, TaskPriority, TaskStatus } from "../types/task.js";

export type SortField = "createdAt" | "priority" | "status" | "title";
export type SortOrder = "asc" | "desc";

interface TaskStoreState {
  // search & filter
  searchQuery: string;
  statusFilter: TaskStatus | "all";
  priorityFilter: TaskPriority | "all";
  sortBy: SortField;
  sortOrder: SortOrder;

  // modal state
  isFormModalOpen: boolean;
  editingTask: Task | null;
  deletingTask: Task | null;

  // filter actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TaskStatus | "all") => void;
  setPriorityFilter: (priority: TaskPriority | "all") => void;
  setSortBy: (field: SortField) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;

  // modal actions
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeFormModal: () => void;
  openDeleteModal: (task: Task) => void;
  closeDeleteModal: () => void;
}

const initialFilters = {
  searchQuery: "",
  statusFilter: "all" as const,
  priorityFilter: "all" as const,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
};

export const useTaskStore = create<TaskStoreState>((set) => ({
  ...initialFilters,

  isFormModalOpen: false,
  editingTask: null,
  deletingTask: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setSortBy: (field) =>
    set((state) => ({
      sortBy: field,
      sortOrder: state.sortBy === field && state.sortOrder === "asc" ? "desc" : "asc",
    })),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),
  resetFilters: () => set(initialFilters),

  openCreateModal: () => set({ isFormModalOpen: true, editingTask: null }),
  openEditModal: (task) => set({ isFormModalOpen: true, editingTask: task }),
  closeFormModal: () => set({ isFormModalOpen: false, editingTask: null }),

  openDeleteModal: (task) => set({ deletingTask: task }),
  closeDeleteModal: () => set({ deletingTask: null }),
}));
