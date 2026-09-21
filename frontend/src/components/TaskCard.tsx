import { useState, useRef, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Task, TaskPriority, TaskStatus } from "../types/task.js";
import { useTaskStore } from "../store/useTaskStore.js";
import { useUpdateTask } from "../hooks/useTasks.js";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppSelect, type SelectOption } from "./AppSelect.js";

interface TaskCardProps {
  task: Task;
}

const priorityConfig: Record<TaskPriority, { label: string; badgeClass: string }> = {
  low: {
    label: "Low",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  high: {
    label: "High",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  },
};

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: typeof Clock; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  },
  in_progress: {
    label: "In Progress",
    icon: PlayCircle,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
};

const cardStatusOptions: SelectOption<TaskStatus>[] = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "in_progress", label: "In Progress", icon: PlayCircle },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const DESC_CLAMP_LINES = 3;

export function TaskCard({ task }: TaskCardProps) {
  const openEditModal = useTaskStore((s) => s.openEditModal);
  const openDeleteModal = useTaskStore((s) => s.openDeleteModal);
  const updateTask = useUpdateTask();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }
  }, [task.description]);

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    updateTask.mutate(
      { id: task.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Task marked as ${statusConfig[newStatus].label.toLowerCase()}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update task status");
        },
      }
    );
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <AppSelect<TaskStatus>
            variant="badge"
            badgeClass={status.badgeClass}
            value={task.status}
            options={cardStatusOptions}
            onChange={handleStatusChange}
            disabled={updateTask.isPending}
            aria-label="Change task status"
          />

          <Badge
            variant="outline"
            className={`rounded-full px-2.5 text-xs font-medium ${priority.badgeClass}`}
          >
            {priority.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => openEditModal(task)}
            title="Edit task"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => openDeleteModal(task)}
            title="Delete task"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 flex-1">
        <h3
          className={`text-base sm:text-lg font-bold text-foreground leading-snug break-words ${
            task.status === "completed" ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <div>
            <p
              ref={descRef}
              className={`text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words leading-relaxed ${
                task.status === "completed" ? "line-through opacity-70" : ""
              } ${!isExpanded ? `line-clamp-${DESC_CLAMP_LINES}` : ""}`}
              style={
                !isExpanded
                  ? {
                      WebkitLineClamp: DESC_CLAMP_LINES,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
                  : undefined
              }
            >
              {task.description}
            </p>
            {(isClamped || isExpanded) && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer mt-1 gap-1"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> Show more
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{formattedDate}</span>
        </span>
        <span className="text-xs text-muted-foreground/70">Click status to change</span>
      </div>
    </Card>
  );
}
