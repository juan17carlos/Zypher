// frontend/src/components/ui/Sidebar.tsx
// Sidebar EXACTO como Bitrix24 con efecto de expansión

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Home,
  Users,
  Briefcase,
  CheckSquare,
  Calendar,
  Mail,
  MessageSquare,
  BarChart3,
  Settings,
  LucideIcon,
  FileText,
  DollarSign,
  Target,
  Bell,
  Search,
} from 'lucide-react'

interface MenuItem {
  icon: LucideIcon
  label: string
  badge?: number
  href?: string
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Inicio', href: '/dashboard' },
  { icon: Users, label: 'Contactos', href: '/contacts' },
  { icon: Briefcase, label: 'Negociaciones', badge: 5, href: '/deals' },
  { icon: CheckSquare, label: 'Tareas', badge: 12, href: '/tasks' },
  { icon: Calendar, label: 'Calendario', href: '/calendar' },
  { icon: Mail, label: 'Email', badge: 3, href: '/email' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: FileText, label: 'Documentos', href: '/documents' },
  { icon: DollarSign, label: 'Facturación', href: '/billing' },
  { icon: Target, label: 'Objetivos', href: '/goals' },
  { icon: BarChart3, label: 'Reportes', href: '/reports' },
  { icon: Search, label: 'Búsqueda', href: '/search' },
]

export default function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Sidebar Colapsado - Default */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isExpanded ? -80 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF] flex flex-col items-center py-6 z-40"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.95) 0%, rgba(30, 64, 175, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 cursor-pointer backdrop-blur-sm border border-white/20"
        >
          <span className="text-white font-bold text-xl">Z</span>
        </motion.div>

        {/* Menu Items */}
        <div className="flex-1 w-full flex flex-col items-center gap-2 px-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => {
                setHoveredIndex(index)
                setIsExpanded(true)
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
                setIsExpanded(false)
              }}
              className="relative w-full"
            >
              {/* Icon Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-12 flex items-center justify-center rounded-xl text-white/70 hover:text-white transition-all relative ${
                  hoveredIndex === index ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-6 h-6" />

                {/* Badge */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.button>

              {/* Tooltip expandido */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-full ml-3 top-0 z-50 pointer-events-none"
                  >
                    <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm border border-white/10">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Flecha */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                        <div className="w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-white/10"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Settings y Notificaciones al final */}
        <div className="w-full flex flex-col items-center gap-2 px-3 pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-12 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all relative"
            onMouseEnter={() => {
              setHoveredIndex(100)
              setIsExpanded(true)
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
              setIsExpanded(false)
            }}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg"></span>
          </motion.button>

          {/* Tooltip Notificaciones */}
          <AnimatePresence>
            {hoveredIndex === 100 && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                className="absolute left-full ml-3 bottom-16 z-50 pointer-events-none"
              >
                <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" />
                    <span className="font-medium">Notificaciones</span>
                  </div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                    <div className="w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-12 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
            onMouseEnter={() => {
              setHoveredIndex(101)
              setIsExpanded(true)
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
              setIsExpanded(false)
            }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>

          {/* Tooltip Settings */}
          <AnimatePresence>
            {hoveredIndex === 101 && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                className="absolute left-full ml-3 bottom-4 z-50 pointer-events-none"
              >
                <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl whitespace-nowrap backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Configuración</span>
                  </div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                    <div className="w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-white/10"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
