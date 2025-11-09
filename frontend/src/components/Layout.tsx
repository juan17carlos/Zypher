import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { Search, Bell, ChevronDown, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import SidebarBitrix from '@/components/ui/SidebarBitrix'
import AnimatedButton from '@/components/ui/AnimatedButton'

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar estilo Bitrix24 */}
      <SidebarBitrix />

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar - Estilo Bitrix24 */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Zypher CRM</h1>

                <AnimatedButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Nuevo
                </AnimatedButton>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en CRM..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                  />
                </div>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </motion.button>

                {/* User menu */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
