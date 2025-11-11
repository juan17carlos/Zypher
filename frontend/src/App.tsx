import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPageNew from './pages/DashboardPageNew'
import ContactsPage from './pages/ContactsPage'
import DealsPageNew from './pages/DealsPageNew'
import TasksPageNew from './pages/TasksPageNew'
import SettingsPage from './pages/SettingsPage'

// Demo
import DemoIndex from './pages/DemoIndex'
import DesignShowcase from './components/demo/DesignShowcase'
import Bitrix24Replica from './components/demo/Bitrix24Replica'
import KanbanBoard from './components/demo/KanbanBoard'
import FormComponents from './components/demo/FormComponents'

// Layout - NUEVO diseño estilo Facturación Pro
import DashboardLayout from './components/DashboardLayout'

function App() {
  const { isAuthenticated } = useAuthStore()

  // Habilitar dark mode por defecto
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* Demo de diseño (acceso público para ver los efectos) */}
      <Route path="/demos" element={<DemoIndex />} />
      <Route path="/design-showcase" element={<DesignShowcase />} />
      <Route path="/bitrix24-replica" element={<Bitrix24Replica />} />
      <Route path="/kanban-demo" element={<KanbanBoard />} />
      <Route path="/form-components" element={<FormComponents />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPageNew />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="deals" element={<DealsPageNew />} />
        <Route path="tasks" element={<TasksPageNew />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
