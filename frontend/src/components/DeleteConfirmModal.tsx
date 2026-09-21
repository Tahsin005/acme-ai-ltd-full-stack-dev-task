import { AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTaskStore } from "../store/useTaskStore.js";
import { useDeleteTask } from "../hooks/useTasks.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmModal() {
  const deletingTask = useTaskStore((s) => s.deletingTask);
  const closeModal = useTaskStore((s) => s.closeDeleteModal);

  const deleteTask = useDeleteTask();

  const isOpen = Boolean(deletingTask);

  const handleDelete = () => {
    if (!deletingTask) return;
    deleteTask.mutate(deletingTask.id, {
      onSuccess: () => {
        toast.success("Task deleted successfully");
        closeModal();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete task");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-destructive/10 text-destructive rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <DialogHeader className="text-left p-0">
              <DialogTitle className="text-base font-bold">Delete Task</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground pt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  "{deletingTask?.title}"
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={deleteTask.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="cursor-pointer gap-2"
          >
            {deleteTask.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{deleteTask.isPending ? "Deleting..." : "Delete Task"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
