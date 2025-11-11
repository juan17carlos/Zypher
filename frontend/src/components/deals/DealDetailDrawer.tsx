// frontend/src/components/deals/DealDetailDrawer.tsx
// Panel lateral unificado estilo Bitrix24 - TODO en un solo lugar

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Loader2,
  Phone,
  Mail,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  MessageCircle,
  FileText,
  Save,
  Edit,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import dealsService from '@/services/dealsService'
import tasksService from '@/services/tasksService'
import type { DealOut } from '@/types/deal'
import type { TaskOut, TaskCreate } from '@/types/task'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DealDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  dealId: number | null
  onUpdate: () => void
  onEdit?: () => void
}

export default function DealDetailDrawer({
  isOpen,
  onClose,
  dealId,
  onUpdate,
  onEdit,
}: DealDetailDrawerProps) {
  const [deal, setDeal] = useState<DealOut | null>(null)
  const [tasks, setTasks] = useState<TaskOut[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [creatingTask, setCreatingTask] = useState(false)

  useEffect(() => {
    if (isOpen && dealId) {
      loadDealData()
      loadTasks()
    }
  }, [isOpen, dealId])

  const loadDealData = async () => {
    if (!dealId) return
    try {
      setLoading(true)
      const data = await dealsService.getById(dealId)
      setDeal(data)
    } catch (err) {
      console.error('Error loading deal:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    if (!dealId) return
    try {
      setLoadingTasks(true)
      const response = await tasksService.getAllWithPagination({
        deal_id: dealId,
        limit: 50,
      })
      setTasks(response.items)
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoadingTasks(false)
    }
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !dealId) return

    try {
      setCreatingTask(true)
      const newTask: TaskCreate = {
        title: newTaskTitle,
        description: null,
        status: 'pending',
        priority: 'medium',
        due_date: null,
        contact_id: deal?.contact_id || null,
        deal_id: dealId,
      }

      await tasksService.create(newTask)
      setNewTaskTitle('')
      loadTasks()
      onUpdate()
    } catch (err) {
      console.error('Error creating task:', err)
    } finally {
      setCreatingTask(false)
    }
  }

  const handleQuickAction = (type: 'whatsapp' | 'phone' | 'email') => {
    if (!deal?.contact) return

    const contact = deal.contact
    switch (type) {
      case 'whatsapp':
        if (contact.phone) {
          const cleanPhone = contact.phone.replace(/\D/g, '')
          window.open(`https://wa.me/${cleanPhone}`, '_blank')
        }
        break
      case 'phone':
        if (contact.phone) {
          window.location.href = `tel:${contact.phone}`
        }
        break
      case 'email':
        if (contact.email) {
          window.location.href = `mailto:${contact.email}`
        }
        break
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : deal ? (
              <>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {deal.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {dealsService.formatCurrency(deal.value, deal.currency)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {deal.probability}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {deal.expected_close_date
                            ? format(new Date(deal.expected_close_date), 'dd MMM yyyy', {
                                locale: es,
                              })
                            : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </motion.button>
                    )}
                    {deal.contact?.phone && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickAction('whatsapp')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                          WhatsApp
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickAction('phone')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Llamar
                        </motion.button>
                      </>
                    )}
                    {deal.contact?.email && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction('email')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Información del Contacto */}
                  {deal.contact && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Información del Contacto
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nombre:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {deal.contact.full_name}
                          </span>
                        </div>
                        {deal.contact.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Teléfono:</span>
                            <a
                              href={`tel:${deal.contact.phone}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              {deal.contact.phone}
                            </a>
                          </div>
                        )}
                        {deal.contact.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Email:</span>
                            <a
                              href={`mailto:${deal.contact.email}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              {deal.contact.email}
                            </a>
                          </div>
                        )}
                        {deal.contact.company && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              Empresa:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {deal.contact.company}
                            </span>
                          </div>
                        )}
                        {deal.contact.city && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Ciudad:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {deal.contact.city}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detalles del Negocio */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Detalles del Negocio
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {dealsService.formatCurrency(deal.value, deal.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Probabilidad:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {deal.probability}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Etapa:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {deal.stage}
                        </span>
                      </div>
                      {deal.owner && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Propietario:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {deal.owner.full_name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Creado:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(deal.created_at), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tareas */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Tareas ({tasks.length})
                      </h3>
                    </div>

                    <div className="p-4 space-y-3">
                      {loadingTasks ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                      ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {task.title}
                              </p>
                              {task.due_date && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(task.due_date), 'dd MMM yyyy HH:mm', {
                                    locale: es,
                                  })}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-8">
                          No hay tareas aún
                        </p>
                      )}

                      {/* Crear tarea rápida */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
                          placeholder="Crear tarea rápida..."
                          disabled={creatingTask}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCreateTask}
                          disabled={!newTaskTitle.trim() || creatingTask}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium inline-flex items-center gap-2"
                        >
                          {creatingTask ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Actividad / Timeline */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Actividad Reciente
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Timeline de actividad */}
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Deal creado</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {format(new Date(deal.created_at), "dd MMM yyyy 'a las' HH:mm", {
                                locale: es,
                              })}
                            </p>
                          </div>
                        </div>

                        {deal.updated_at !== deal.created_at && (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Save className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Última actualización
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {format(new Date(deal.updated_at), "dd MMM yyyy 'a las' HH:mm", {
                                  locale: es,
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Agregar nota rápida (placeholder para futuro) */}
                      <div className="pt-3 border-t border-gray-100">
                        <textarea
                          placeholder="Agregar nota rápida..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Guardar Nota
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">No se encontró el deal</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
