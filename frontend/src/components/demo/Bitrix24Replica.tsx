// frontend/src/components/demo/Bitrix24Replica.tsx
// Réplica EXACTA del diseño de Bitrix24

import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Briefcase,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  MoreVertical,
  Clock,
  MapPin,
  Star,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  User,
  Building,
  DollarSign,
  Target,
  Activity,
  Paperclip,
  Send,
  Video,
  Mic,
} from 'lucide-react'
import { useState } from 'react'
import SidebarBitrix from '@/components/ui/SidebarBitrix'

export default function Bitrix24Replica() {
  const [activeSection, setActiveSection] = useState('timeline')

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar EXACTO como Bitrix24 */}
      <SidebarBitrix />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Como Bitrix24 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Search bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en CRM..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo
            </motion.button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                JB
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Deal Header - Como Bitrix24 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              {/* Header con color */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-2xl font-bold">Proyecto Web - Tech Corp</h1>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 72 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-yellow-300 hover:text-yellow-200"
                      >
                        <Star className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-6 text-blue-100 text-sm">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        En negociación
                      </span>
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        $45,000 USD
                      </span>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Juan Bastidas
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Vence: 20 Nov 2025
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                    >
                      Crear cotización
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Factura
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 bg-white">
                <div className="flex px-6">
                  {[
                    { id: 'timeline', label: 'Timeline', icon: Activity },
                    { id: 'details', label: 'Detalles', icon: FileText },
                    { id: 'products', label: 'Productos', icon: Target },
                    { id: 'docs', label: 'Documentos', icon: Paperclip },
                    { id: 'history', label: 'Historial', icon: Clock },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      onClick={() => setActiveSection(tab.id)}
                      className={`px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors relative ${
                        activeSection === tab.id
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {activeSection === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {activeSection === 'timeline' && (
                  <div className="space-y-4">
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Llamada
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Reunión
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Tarea
                      </motion.button>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-4 mt-6">
                      {[
                        {
                          type: 'call',
                          icon: Phone,
                          color: 'green',
                          title: 'Llamada completada',
                          description: 'Conversación de 15 minutos sobre requisitos del proyecto',
                          time: 'Hace 2 horas',
                          user: 'Juan Bastidas',
                        },
                        {
                          type: 'email',
                          icon: Mail,
                          color: 'blue',
                          title: 'Email enviado',
                          description: 'Propuesta comercial enviada al cliente',
                          time: 'Ayer a las 14:30',
                          user: 'Juan Bastidas',
                        },
                        {
                          type: 'meeting',
                          icon: Calendar,
                          color: 'purple',
                          title: 'Reunión agendada',
                          description: 'Presentación de propuesta - 20 Nov 2025, 10:00 AM',
                          time: 'Hace 2 días',
                          user: 'Sistema',
                        },
                        {
                          type: 'note',
                          icon: FileText,
                          color: 'orange',
                          title: 'Nota agregada',
                          description: 'Cliente interesado en módulo adicional de reporting',
                          time: 'Hace 3 días',
                          user: 'María González',
                        },
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                          className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
                        >
                          <div
                            className={`flex-shrink-0 w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}
                          >
                            <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {activity.user}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          JB
                        </div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Agregar comentario o nota..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          />
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Adjuntar archivo"
                              >
                                <Paperclip className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Agregar video"
                              >
                                <Video className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Nota de voz"
                              >
                                <Mic className="w-5 h-5" />
                              </motion.button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Enviar
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
