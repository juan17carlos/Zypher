// frontend/src/components/ui/SidebarBitrix.tsx
// Sidebar EXACTO como Bitrix24 - expandible con menú completo

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Home,
  Users,
  Briefcase,
  Calendar,
  CheckSquare,
  Mail,
  MessageSquare,
  ShoppingCart,
  Palette,
  BarChart3,
  FileText,
  Settings,
  Package,
  Users2,
  CreditCard,
  Target,
  Zap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface MenuItem {
  icon: any
  label: string
  badge?: number
  items?: { label: string; href?: string }[]
  href?: string
}

const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Briefcase,
    label: 'CRM',
    items: [
      { label: 'Negociaciones', href: '/deals' },
      { label: 'Contactos', href: '/contacts' },
      { label: 'Tareas', href: '/tasks' },
    ],
  },
  {
    icon: Calendar,
    label: 'Calendario',
    href: '/calendar',
  },
  {
    icon: BarChart3,
    label: 'Reportes',
    href: '/reports',
  },
  {
    icon: Settings,
    label: 'Configuración',
    href: '/settings',
  },
]

export default function SidebarBitrix() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<number[]>([1])
  const navigate = useNavigate()
  const location = useLocation()

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleNavigation = (href?: string) => {
    if (href) {
      navigate(href)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Botón hamburguesa flotante - MOVIDO ABAJO */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar expandible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-b from-[#4A5C7C]/95 to-[#5D6D8E]/95 backdrop-blur-md shadow-2xl z-40 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(74, 92, 124, 0.95) 0%, rgba(93, 109, 142, 0.95) 100%)',
            }}
          >
            {/* Header del sidebar */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-white" />
                </motion.button>
                <span className="text-white font-medium text-sm">Ampliar el menú</span>
              </div>
            </div>

            {/* Menu items scrollable */}
            <div className="overflow-y-auto h-[calc(100vh-80px)] py-2 px-2">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                  {/* Item principal */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    onClick={() => {
                      if (item.items) {
                        toggleItem(index)
                      } else {
                        handleNavigation(item.href)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-white/90 hover:text-white transition-all group ${
                      expandedItems.includes(index) || location.pathname === item.href ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-normal text-left">{item.label}</span>

                      {/* Badge */}
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </div>

                    {/* Chevron si tiene subitems */}
                    {item.items && (
                      <motion.div
                        animate={{ rotate: expandedItems.includes(index) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Subitems expandibles */}
                  <AnimatePresence>
                    {item.items && expandedItems.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-11 py-1 space-y-1">
                          {item.items.map((subitem, subIndex) => (
                            <motion.button
                              key={subIndex}
                              whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.05)' }}
                              onClick={() => handleNavigation(subitem.href)}
                              className={`w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg transition-all ${
                                location.pathname === subitem.href ? 'bg-white/10 text-white font-medium' : ''
                              }`}
                            >
                              {subitem.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Botón upgrade al final */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 mx-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Mejore su plan
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
