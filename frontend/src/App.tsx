import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header.js";
import { TaskFormModal } from "./components/TaskFormModal.js";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal.js";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Outlet />
      </main>

      <TaskFormModal />
      <DeleteConfirmModal />
    </div>
  );
}