import { Search, X, ArrowUpDown, RotateCcw } from "lucide-react";
import { useTaskStore, type SortField } from "../store/useTaskStore.js";
import type { TaskPriority, TaskStatus } from "../types/task.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppSelect, type SelectOption } from "./AppSelect.js";

const statusOptions: SelectOption<TaskStatus | "all">[] = [
  { 
    value: "all", 
    label: "All statuses" 
  },
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

const priorityOptions: SelectOption<TaskPriority | "all">[] = [
  { 
    value: "all", 
    label: "All priorities" 
  },
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

const sortOptions: SelectOption<SortField>[] = [
  { 
    value: "createdAt", 
    label: "Date Created" 
  },
  { 
    value: "priority", 
    label: "Priority" 
  },
  { 
    value: "status", 
    label: "Status" 
  },
  { 
    value: "title", 
    label: "Title" 
  },
];

export function TaskFilters() {
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    toggleSortOrder,
    resetFilters,
  } = useTaskStore();

  const isFiltered =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <Card className="p-5 shadow-xs space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="pl-10 pr-10 h-10 text-base sm:text-sm bg-muted/40"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-6 w-6 p-0 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Status:</span>
            <AppSelect<TaskStatus | "all">
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
              placeholder="All statuses"
              className="min-w-[140px]"
              aria-label="Filter by status"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Priority:</span>
            <AppSelect<TaskPriority | "all">
              value={priorityFilter}
              options={priorityOptions}
              onChange={setPriorityFilter}
              placeholder="All priorities"
              className="min-w-[140px]"
              aria-label="Filter by priority"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Sort:</span>
            <AppSelect<SortField>
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              placeholder="Sort by"
              className="min-w-[140px]"
              aria-label="Sort tasks by"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              title={`Sort order: ${sortOrder.toUpperCase()}`}
              className="h-8 gap-1.5 font-semibold text-xs cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="uppercase">{sortOrder}</span>
            </Button>
          </div>

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
