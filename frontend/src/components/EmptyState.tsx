import { Inbox, SearchX, AlertCircle, Plus, RotateCcw, RefreshCw } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-tasks" | "no-matches" | "error";
  errorMessage?: string;
  onRetry?: () => void;
}

export function EmptyState({ type, errorMessage, onRetry }: EmptyStateProps) {
  const openCreateModal = useTaskStore((s) => s.openCreateModal);
  const resetFilters = useTaskStore((s) => s.resetFilters);

  if (type === "error") {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-8 text-center shadow-xs">
        <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">Failed to load tasks</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
          {errorMessage || "Unable to reach the server. Please check your backend connection."}
        </p>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="cursor-pointer gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}
      </Card>
    );
  }

  if (type === "no-matches") {
    return (
      <Card className="border-dashed p-8 text-center shadow-xs">
        <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No matching tasks</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
          No tasks matched your current search and filter criteria.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          className="cursor-pointer gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filters</span>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-dashed p-12 text-center shadow-xs">
      <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">No tasks yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">
        Get started by creating your first task to track your work.
      </p>
      <Button
        type="button"
        onClick={openCreateModal}
        className="cursor-pointer gap-2 shadow-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        <span>Create First Task</span>
      </Button>
    </Card>
  );
}
