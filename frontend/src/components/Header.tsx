import { CheckSquare, Download, Sparkles, Plus } from "lucide-react";
import { Link, useLocation } from "react-router";
import { usePWAInstall } from "../hooks/usePWAInstall.js";
import { useTaskStore } from "../store/useTaskStore.js";
import { Button } from "@/components/ui/button";

export function Header() {
  const { canInstall, install } = usePWAInstall();
  const location = useLocation();
  const openCreateModal = useTaskStore((s) => s.openCreateModal);

  return (
    <header className="border-b border-border bg-card sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3.5 hover:opacity-80 transition-opacity">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs shrink-0">
            <CheckSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Task Portal</h1>
            <p className="text-sm text-muted-foreground">Manage, track, and complete your tasks</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
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

          {location.pathname !== "/upgrade" && (
            <Button
              asChild
              variant="outline"
              size="default"
              className="cursor-pointer gap-2 font-semibold h-10 px-4"
              id="upgrade-btn"
            >
              <Link to="/upgrade">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
              </Link>
            </Button>
          )}

          <Button
            type="button"
            onClick={openCreateModal}
            size="default"
            className="cursor-pointer gap-2 font-semibold h-10 px-4"
            id="new-task-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
