import { useMemo } from "react";
import { useTasks } from "../hooks/useTasks.js";
import { useTaskStore } from "../store/useTaskStore.js";
import { TaskFilters } from "../components/TaskFilters.js";
import { TaskCard } from "../components/TaskCard.js";
import { TaskSkeleton } from "../components/TaskSkeleton.js";
import { EmptyState } from "../components/EmptyState.js";
import type { TaskPriority, TaskStatus } from "../types/task.js";

const priorityWeight: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const statusWeight: Record<TaskStatus, number> = {
  pending: 1,
  in_progress: 2,
  completed: 3,
};

export function TasksPage() {
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasks();

  const searchQuery = useTaskStore((s) => s.searchQuery);
  const statusFilter = useTaskStore((s) => s.statusFilter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);
  const sortBy = useTaskStore((s) => s.sortBy);
  const sortOrder = useTaskStore((s) => s.sortOrder);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter !== "all" && task.status !== statusFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== "all" && task.priority !== priorityFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDescription = (task.description || "").toLowerCase().includes(q);
          if (!matchesTitle && !matchesDescription) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === "createdAt") {
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "priority") {
          diff = priorityWeight[a.priority] - priorityWeight[b.priority];
        } else if (sortBy === "status") {
          diff = statusWeight[a.status] - statusWeight[b.status];
        } else if (sortBy === "title") {
          diff = a.title.localeCompare(b.title);
        }
        return sortOrder === "asc" ? diff : -diff;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

  return (
    <>
      <TaskFilters />

      <section aria-label="Task list">
        {isLoading ? (
          <TaskSkeleton />
        ) : isError ? (
          <EmptyState
            type="error"
            errorMessage={error?.message}
            onRetry={() => refetch()}
          />
        ) : tasks.length === 0 ? (
          <EmptyState type="no-tasks" />
        ) : filteredTasks.length === 0 ? (
          <EmptyState type="no-matches" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
