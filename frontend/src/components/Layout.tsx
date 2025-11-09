import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { LayoutDashboard, Users, DollarSign, CheckSquare, LogOut } from 'lucide-react'

export default function Layout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
      clearAuth()
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary-600">Zypher CRM</h1>
          <p className="text-sm text-gray-600">{user?.full_name}</p>
        </div>

        <nav className="p-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/contacts"
            className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
          >
            <Users size={20} />
            <span>Contactos</span>
          </Link>

          <Link
            to="/deals"
            className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
          >
            <DollarSign size={20} />
            <span>Pipeline</span>
          </Link>

          <Link
            to="/tasks"
            className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition"
          >
            <CheckSquare size={20} />
            <span>Tareas</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-8 text-red-600 rounded-lg hover:bg-red-50 transition w-full"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
