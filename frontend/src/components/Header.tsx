import { Plus, CheckSquare, Download } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore.js";
import { usePWAInstall } from "../hooks/usePWAInstall.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  totalTasks: number;
}

export function Header({ totalTasks }: HeaderProps) {
  const openCreateModal = useTaskStore((s) => s.openCreateModal);
  const { canInstall, install } = usePWAInstall();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs shrink-0">
            <CheckSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Tasks</h1>
              <Badge variant="secondary" className="font-semibold text-xs">
                {totalTasks}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Manage, track, and complete your tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canInstall && (
            <Button
              type="button"
              onClick={install}
              variant="outline"
              size="default"
              className="cursor-pointer gap-2 font-semibold h-10 px-4"
              id="pwa-install-btn"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install App</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={openCreateModal}
            size="default"
            className="cursor-pointer gap-2 font-semibold h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

