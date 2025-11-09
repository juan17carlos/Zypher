import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { Search, Bell, ChevronDown, Plus, Briefcase, User, CheckSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SidebarBitrix from '@/components/ui/SidebarBitrix'

export default function Layout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showQuickActions, setShowQuickActions] = useState(false)

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

  const quickActions = [
    { icon: Briefcase, label: 'Nueva Negociación', href: '/deals', action: 'create-deal' },
    { icon: User, label: 'Nuevo Contacto', href: '/contacts', action: 'create-contact' },
    { icon: CheckSquare, label: 'Nueva Tarea', href: '/tasks', action: 'create-task' },
  ]

  const handleQuickAction = (action: string, href: string) => {
    navigate(href, { state: { action } })
    setShowQuickActions(false)
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

                {/* Quick Actions Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo
                    <ChevronDown className={`w-4 h-4 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showQuickActions && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowQuickActions(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20"
                        >
                          {quickActions.map((item, index) => {
                            const Icon = item.icon
                            return (
                              <motion.button
                                key={index}
                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                onClick={() => handleQuickAction(item.action, item.href)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                              >
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                  <Icon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="font-medium text-gray-900">{item.label}</span>
                              </motion.button>
                            )
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
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
