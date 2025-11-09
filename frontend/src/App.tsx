import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ContactsPage from './pages/ContactsPage'
import DealsPage from './pages/DealsPage'
import TasksPage from './pages/TasksPage'

// Layout
import Layout from './components/Layout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="tasks" element={<TasksPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
