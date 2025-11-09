// frontend/src/components/demo/DesignShowcase.tsx
// Showcase EXACTO de Bitrix24 - Mismos iconos, colores y diseño

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  DollarSign,
  CheckSquare,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Send,
  Download,
  Share2,
  Settings,
  Bell,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Award,
  Zap,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  FolderOpen,
  MessageSquare,
  Video,
  Mic,
  Paperclip,
  Search,
  Filter,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react'
import AnimatedCard from '@/components/ui/AnimatedCard'
import AnimatedButton from '@/components/ui/AnimatedButton'
import AnimatedModal from '@/components/ui/AnimatedModal'
import IconBadge from '@/components/ui/IconBadge'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import Dropdown, { DropdownTrigger } from '@/components/ui/Dropdown'

export default function DesignShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const dropdownItems = [
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => console.log('Editar'),
    },
    {
      label: 'Ver detalles',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => console.log('Ver'),
    },
    {
      label: 'Compartir',
      icon: <Share2 className="w-4 h-4" />,
      onClick: () => console.log('Compartir'),
    },
    {
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log('Eliminar'),
      danger: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zypher CRM - Diseño Bitrix24
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Mismo diseño, iconos y efectos que Bitrix24
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/bitrix24-replica"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Réplica Completa
            </motion.a>
            <motion.a
              href="/kanban-demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              Kanban Board
            </motion.a>
            <motion.a
              href="/form-components"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Dropdowns & Calendarios
            </motion.a>
          </div>
        </motion.div>

        {/* SECCIÓN NUEVA: Réplica EXACTA de Bitrix24 */}
        <AnimatedCard delay={0.05}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Nueva negociación</h2>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    En desarrollo
                  </span>
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Dólar US
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    16/11/2025
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <AnimatedButton variant="secondary" size="sm">
                  Crear documentos
                </AnimatedButton>
                <AnimatedButton variant="primary" size="sm">
                  Factura
                </AnimatedButton>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white rounded-b-xl">
            {/* Tabs como Bitrix24 */}
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              {['General', 'Productos', 'Cotizaciones', 'Facturas', 'Automatización'].map(
                (tab, index) => (
                  <motion.button
                    key={tab}
                    whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      index === 0
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </motion.button>
                )
              )}
            </div>

            {/* Formulario estilo Bitrix24 */}
            <div className="space-y-6">
              {/* SOBRE LA NEGOCIACIÓN */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Edit className="w-4 h-4 text-gray-400" />
                    SOBRE LA NEGOCIACIÓN
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    cancelar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Negociación #"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Etapa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etapa
                    </label>
                    <div className="relative">
                      <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none">
                        <option>En desarrollo</option>
                        <option>Calificación</option>
                        <option>Propuesta</option>
                        <option>Negociación</option>
                        <option>Ganado</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Monto y Fecha */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto y moneda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <option>Dólar US</option>
                        <option>Euro</option>
                        <option>Peso</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha final
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        defaultValue="2025-11-16"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nombre de contacto, teléfono o correo electrónico"
                        className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Agregar participante
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <AnimatedButton variant="primary" size="lg" icon={<Send className="w-4 h-4" />}>
                    GUARDAR
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="lg">
                    CANCELAR
                  </AnimatedButton>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Adjuntar archivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Más opciones"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 1: Botones con efectos */}
        <AnimatedCard delay={0.1}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBadge icon={Zap} variant="warning" />
              Botones Animados
            </h2>
            <div className="flex flex-wrap gap-3">
              <AnimatedButton variant="primary" icon={<Send className="w-4 h-4" />}>
                Enviar
              </AnimatedButton>
              <AnimatedButton variant="success" icon={<CheckSquare className="w-4 h-4" />}>
                Guardar
              </AnimatedButton>
              <AnimatedButton variant="danger" icon={<Trash2 className="w-4 h-4" />}>
                Eliminar
              </AnimatedButton>
              <AnimatedButton variant="secondary" icon={<Download className="w-4 h-4" />}>
                Descargar
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                loading={loading}
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 2000)
                }}
              >
                {loading ? 'Cargando...' : 'Simular carga'}
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 2: Icon Badges como Bitrix24 */}
        <AnimatedCard delay={0.2}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBadge icon={Star} variant="warning" />
              Icon Badges (Estilo Bitrix24)
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <IconBadge icon={Users} variant="primary" size="md" />
                <span className="text-sm text-gray-700">Contactos</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBadge icon={DollarSign} variant="success" size="md" />
                <span className="text-sm text-gray-700">Deals</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBadge icon={CheckSquare} variant="warning" size="md" />
                <span className="text-sm text-gray-700">Tareas</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBadge icon={TrendingUp} variant="info" size="md" />
                <span className="text-sm text-gray-700">Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBadge icon={Bell} variant="danger" size="md" />
                <span className="text-sm text-gray-700">Alertas</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBadge icon={Award} variant="purple" size="md" />
                <span className="text-sm text-gray-700">Premium</span>
              </div>
            </div>

            {/* Tamaños diferentes */}
            <div className="mt-6 flex items-center gap-4">
              <IconBadge icon={Settings} variant="primary" size="sm" />
              <IconBadge icon={Settings} variant="primary" size="md" />
              <IconBadge icon={Settings} variant="primary" size="lg" />
              <IconBadge icon={Settings} variant="primary" size="xl" />
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 3: Tarjetas con hover mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard delay={0.3} hoverScale>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconBadge icon={Users} variant="primary" size="lg" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                >
                  +12%
                </motion.span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">1,234</h3>
              <p className="text-sm text-gray-600">Contactos Totales</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span>124 este mes</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4} hoverScale>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconBadge icon={DollarSign} variant="success" size="lg" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  +24%
                </motion.span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">$45,678</h3>
              <p className="text-sm text-gray-600">Valor en Pipeline</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>23 deals activos</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.5} hoverScale>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconBadge icon={CheckSquare} variant="warning" size="lg" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                >
                  5 hoy
                </motion.span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">89</h3>
              <p className="text-sm text-gray-600">Tareas Pendientes</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-orange-500 mr-1" />
                  <span>3 vencidas</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Sección 4: Dropdowns mejorados */}
        <AnimatedCard delay={0.6}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBadge icon={MoreVertical} variant="info" />
              Dropdowns con Animaciones
            </h2>
            <div className="flex gap-4">
              <Dropdown
                items={dropdownItems}
                trigger={
                  <DropdownTrigger variant="button">
                    <span>Acciones</span>
                  </DropdownTrigger>
                }
              />

              <Dropdown
                items={dropdownItems}
                trigger={
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                }
              />
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 5: Loading Skeletons */}
        <AnimatedCard delay={0.7}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBadge icon={Clock} variant="info" />
              Loading States (Skeletons)
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Texto:</h3>
                <LoadingSkeleton type="text" lines={3} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Título:</h3>
                <LoadingSkeleton type="title" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <LoadingSkeleton type="card" />
                <LoadingSkeleton type="card" />
                <LoadingSkeleton type="card" />
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 6: Lista con iconos y badges */}
        <AnimatedCard delay={0.8}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBadge icon={Tag} variant="purple" />
              Lista de Contactos (Ejemplo)
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Juan Pérez', email: 'juan@example.com', company: 'Tech Corp', status: 'active' },
                { name: 'María González', email: 'maria@example.com', company: 'Design Studio', status: 'lead' },
                { name: 'Carlos Rodríguez', email: 'carlos@example.com', company: 'Marketing Plus', status: 'inactive' },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 1)' }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {contact.company}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        contact.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : contact.status === 'lead'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {contact.status}
                    </span>
                    <Dropdown
                      items={dropdownItems}
                      trigger={
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Botón para abrir modal */}
        <div className="text-center">
          <AnimatedButton
            variant="primary"
            size="lg"
            onClick={() => setModalOpen(true)}
            icon={<Eye className="w-5 h-5" />}
          >
            Ver Modal Animado
          </AnimatedButton>
        </div>

        {/* Modal ejemplo */}
        <AnimatedModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Modal Estilo Bitrix24"
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Escribe una descripción..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <AnimatedButton variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </AnimatedButton>
              <AnimatedButton variant="primary" icon={<Send className="w-4 h-4" />}>
                Guardar
              </AnimatedButton>
            </div>
          </div>
        </AnimatedModal>
      </div>
    </div>
  )
}
