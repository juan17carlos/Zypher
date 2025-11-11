// frontend/src/components/ui/NotificationsPanel.tsx - Panel de notificaciones

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Users,
  TrendingUp,
  CheckSquare,
  AlertCircle,
  Check,
  X,
  Trash2,
} from 'lucide-react'

interface Notification {
  id: number
  type: 'contact' | 'deal' | 'task' | 'alert'
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'deal',
      title: 'Nuevo Deal Creado',
      message: 'Se ha creado un nuevo deal: "Venta Software CRM"',
      time: 'Hace 5 minutos',
      read: false,
    },
    {
      id: 2,
      type: 'task',
      title: 'Tarea Vencida',
      message: 'La tarea "Llamar al cliente" está vencida',
      time: 'Hace 1 hora',
      read: false,
    },
    {
      id: 3,
      type: 'contact',
      title: 'Nuevo Contacto',
      message: 'Juan Pérez fue agregado a tus contactos',
      time: 'Hace 3 horas',
      read: true,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Recordatorio',
      message: 'Tienes 5 tareas pendientes para hoy',
      time: 'Hace 1 día',
      read: true,
    },
  ])

  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Users className="w-4 h-4" />
      case 'deal':
        return <TrendingUp className="w-4 h-4" />
      case 'task':
        return <CheckSquare className="w-4 h-4" />
      case 'alert':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'contact':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      case 'deal':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      case 'task':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'alert':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                  {unreadCount} sin leer
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-dark-600">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                        !notification.read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${getIconColor(notification.type)} flex-shrink-0`}>
                          {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-dark-400 mt-2">
                            {notification.time}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-dark-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-dark-300">
                    No tienes notificaciones
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-center text-sm text-gray-600 dark:text-dark-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                >
                  Limpiar todas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
