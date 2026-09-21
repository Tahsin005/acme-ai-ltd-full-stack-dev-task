import { useState, useEffect, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTaskStore } from "../store/useTaskStore.js";
import { useCreateTask, useUpdateTask } from "../hooks/useTasks.js";
import type { TaskPriority, TaskStatus } from "../types/task.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AppSelect, type SelectOption } from "./AppSelect.js";

const formPriorityOptions: SelectOption<TaskPriority>[] = [
  {
    value: "low", 
    label: "Low" 
  },
  {
    value: "medium", 
    label: "Medium" 
  },
  {
    value: "high", 
    label: "High" 
  },
];

const formStatusOptions: SelectOption<TaskStatus>[] = [
  {
    value: "pending", 
    label: "Pending"
  },
  {
    value: "in_progress", 
    label: "In Progress"
  },
  {
    value: "completed", 
    label: "Completed"
  },
];

export function TaskFormModal() {
  const isOpen = useTaskStore((s) => s.isFormModalOpen);
  const editingTask = useTaskStore((s) => s.editingTask);
  const closeModal = useTaskStore((s) => s.closeFormModal);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [titleError, setTitleError] = useState("");
  const [serverError, setServerError] = useState("");

  const isEditing = Boolean(editingTask);
  const isSubmitting = createTask.isPending || updateTask.isPending;

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || "");
        setPriority(editingTask.priority);
        setStatus(editingTask.status);
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("pending");
      }
      setTitleError("");
      setServerError("");
    }
  }, [isOpen, editingTask]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Task title is required");
      return;
    }

    if (trimmedTitle.length > 255) {
      setTitleError("Title cannot exceed 255 characters");
      return;
    }

    setTitleError("");
    setServerError("");

    if (isEditing && editingTask) {
      updateTask.mutate(
        {
          id: editingTask.id,
          data: {
            title: trimmedTitle,
            description: description.trim(),
            priority,
            status,
          },
        },
        {
          onSuccess: () => {
            toast.success("Task updated successfully");
            closeModal();
          },
          onError: (err) => {
            setServerError(err.message || "Failed to update task");
          },
        }
      );
    } else {
      createTask.mutate(
        {
          title: trimmedTitle,
          description: description.trim(),
          priority,
          status,
        },
        {
          onSuccess: () => {
            toast.success("Task created successfully");
            closeModal();
          },
          onError: (err) => {
            setServerError(err.message || "Failed to create task");
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {serverError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="task-title" className="block text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="e.g. Implement user authentication"
              maxLength={255}
              aria-invalid={Boolean(titleError)}
              autoFocus
            />
            {titleError && <p className="text-xs text-destructive font-medium">{titleError}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="task-description" className="block text-sm font-medium text-foreground">
              Description <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional context or notes..."
              className="resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="task-priority" className="block text-sm font-medium text-foreground">
                Priority
              </label>
              <AppSelect<TaskPriority>
                id="task-priority"
                variant="form"
                value={priority}
                options={formPriorityOptions}
                onChange={setPriority}
                placeholder="Select priority"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-status" className="block text-sm font-medium text-foreground">
                Status
              </label>
              <AppSelect<TaskStatus>
                id="task-status"
                variant="form"
                value={status}
                options={formStatusOptions}
                onChange={setStatus}
                placeholder="Select status"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
