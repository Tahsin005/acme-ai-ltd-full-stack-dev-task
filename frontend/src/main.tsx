import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import { TasksPage } from './pages/TasksPage.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { UpgradePage } from './pages/UpgradePage.tsx'
import { SuccessPage } from './pages/SuccessPage.tsx'
import { CancelPage } from './pages/CancelPage.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<TasksPage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="cancel" element={<CancelPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
