// frontend/src/components/DashboardLayout.tsx
// Layout principal del CRM con diseño de Facturación Electrónica Pro

import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import {
  Home,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  User as UserIcon,
  Plus,
  Moon,
  Sun,
  Monitor,
  Check,
  HelpCircle,
  Shield,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalSearch from '@/components/ui/GlobalSearch'
import NotificationsPanel from '@/components/ui/NotificationsPanel'

interface NavigationItem {
  path: string
  label: string
  icon: any
  badge?: number | null
  subItems?: NavigationSubItem[]
}

interface NavigationSubItem {
  path: string
  label: string
  icon: any
}

export default function DashboardLayout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['crm'])
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('dark')
  const [showMobileDrawer, setShowMobileDrawer] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)

  // Navigation items con estructura CRM
  const navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      badge: null
    },
    {
      path: '#',
      label: 'CRM',
      icon: Briefcase,
      badge: null,
      subItems: [
        {
          path: '/contacts',
          label: 'Contactos',
          icon: Users
        },
        {
          path: '/deals',
          label: 'Deals',
          icon: Briefcase
        },
        {
          path: '/tasks',
          label: 'Tareas',
          icon: CheckSquare
        }
      ]
    },
    {
      path: '/reports',
      label: 'Reportes',
      icon: BarChart3,
      badge: null
    },
    {
      path: '/settings',
      label: 'Configuración',
      icon: Settings,
      badge: null
    }
  ]

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

  const toggleMenu = useCallback((label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }, [])

  const isActive = useCallback((path: string) => {
    if (path === '#') return false
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }, [location.pathname])

  const isParentActive = useCallback((item: NavigationItem) => {
    if (!item.subItems) return false
    return item.subItems.some(subItem => isActive(subItem.path))
  }, [isActive])

  const handleNavigation = useCallback((path: string, hasSubItems?: boolean) => {
    if (path === '#' || hasSubItems) return
    navigate(path)
    setShowMobileDrawer(false)
  }, [navigate])

  // Click outside para cerrar user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* SIDEBAR DESKTOP */}
      <div
        className={`hidden lg:flex ${isSidebarCollapsed ? 'w-20' : 'w-64'
          } bg-white dark:bg-dark-800 shadow-sm flex-col transition-all duration-300 border-r border-gray-200 dark:border-dark-700 relative`}
      >
        {/* Logo y toggle */}
        <div className={`flex items-center h-16 border-b border-gray-100 dark:border-dark-700 ${isSidebarCollapsed ? 'px-3 justify-center' : 'justify-between px-4'
          }`}>
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Zypher CRM</span>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isSidebarCollapsed ? 'p-2 pt-4 space-y-0.5' : 'p-2 space-y-1'
          }`}>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const itemIsActive = isActive(item.path)
            const parentIsActive = isParentActive(item)
            const isExpanded = expandedMenus.includes(item.label)
            const hasSubItems = !!item.subItems

            return (
              <div key={item.label}>
                {/* Item principal */}
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.label)
                    } else {
                      handleNavigation(item.path)
                    }
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-3'
                    } rounded-lg transition-all duration-200 group ${(itemIsActive || parentIsActive) && !isSidebarCollapsed
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                >
                  {isSidebarCollapsed ? (
                    <Icon className={`w-5 h-5 ${(itemIsActive || parentIsActive) ? 'text-white' : ''
                      }`} />
                  ) : (
                    <>
                      <Icon className={`w-5 h-5 mr-3 ${(itemIsActive || parentIsActive) ? 'text-white' : ''
                        }`} />
                      <span className="flex-1 text-left font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {hasSubItems && (
                        <ChevronDown
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Subitems */}
                {hasSubItems && !isSidebarCollapsed && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 py-1 space-y-0.5">
                          {item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon
                            const subItemIsActive = isActive(subItem.path)

                            return (
                              <button
                                key={subItem.path}
                                onClick={() => handleNavigation(subItem.path)}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${subItemIsActive
                                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500 font-medium'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400'
                                  }`}
                              >
                                <SubIcon className="w-4 h-4 mr-2" />
                                {subItem.label}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Mobile menu + Search */}
              <div className="flex items-center gap-4 flex-1">
                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMobileDrawer(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Global Search */}
                <div className="hidden md:flex relative flex-1 max-w-md">
                  <GlobalSearch />
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Notifications Panel */}
                <NotificationsPanel />

                {/* Theme toggle */}
                <button className="hidden md:flex p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  {currentTheme === 'dark' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    ref={userMenuButtonRef}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.full_name || 'Usuario'}
                    </span>
                    <ChevronDown className="hidden lg:block w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* User dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        ref={userMenuRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.full_name || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {user?.email || ''}
                          </p>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => {
                              navigate('/profile')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
                          >
                            <UserIcon className="w-4 h-4 mr-3" />
                            Mi Perfil
                          </button>
                          <button
                            onClick={() => {
                              navigate('/settings')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Configuración
                          </button>
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              // Show keyboard shortcuts modal (future implementation)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
                          >
                            <Zap className="w-4 h-4 mr-3" />
                            Atajos de Teclado
                          </button>
                        </div>

                        <div className="border-t border-gray-100 dark:border-dark-700 py-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              // Navigate to help center (future implementation)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
                          >
                            <HelpCircle className="w-4 h-4 mr-3" />
                            Centro de Ayuda
                          </button>
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              // Navigate to privacy settings (future implementation)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center transition-colors"
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Privacidad y Seguridad
                          </button>
                        </div>

                        <div className="border-t border-gray-100 dark:border-dark-700 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-900 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {showMobileDrawer && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileDrawer(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-dark-800 shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              {/* Header móvil */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Z</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">Zypher CRM</span>
                </div>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Navigation móvil */}
              <nav className="p-2 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const itemIsActive = isActive(item.path)
                  const parentIsActive = isParentActive(item)
                  const isExpanded = expandedMenus.includes(item.label)
                  const hasSubItems = !!item.subItems

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          if (hasSubItems) {
                            toggleMenu(item.label)
                          } else {
                            handleNavigation(item.path)
                          }
                        }}
                        className={`w-full flex items-center px-3 py-3 rounded-lg transition-all ${(itemIsActive || parentIsActive)
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                          }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''
                              }`}
                          />
                        )}
                      </button>

                      {hasSubItems && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-8 py-1 space-y-0.5">
                                {item.subItems?.map((subItem) => {
                                  const SubIcon = subItem.icon
                                  const subItemIsActive = isActive(subItem.path)

                                  return (
                                    <button
                                      key={subItem.path}
                                      onClick={() => handleNavigation(subItem.path)}
                                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all ${subItemIsActive
                                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                                        }`}
                                    >
                                      <SubIcon className="w-4 h-4 mr-2" />
                                      {subItem.label}
                                    </button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
