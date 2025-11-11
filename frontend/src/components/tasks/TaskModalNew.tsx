// frontend/src/components/tasks/TaskModalNew.tsx - Modal con diseño Facturación Pro

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ListTodo,
  Calendar,
  Flag,
  FileText,
  AlertCircle,
  Loader2,
  Save,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import type { TaskOut, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '@/types/task'
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  StatusLabels,
  PriorityLabels,
} from '@/types/task'
import CustomDropdown from '@/components/ui/CustomDropdown'

interface TaskModalNewProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  task?: TaskOut | null
}

interface ValidationError {
  field: string
  message: string
}

interface ExpandableSectionProps {
  title: string
  icon: React.ElementType
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  isRequired?: boolean
  isCompleted?: boolean
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  isRequired = false,
  isCompleted = false,
}) => {
  return (
    <div className="border border-gray-200 dark:border-dark-600 rounded-lg mb-4 bg-white dark:bg-dark-800 shadow-sm overflow-visible">
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 cursor-pointer transition-all duration-200 min-h-[56px] rounded-t-lg"
      >
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-white dark:bg-dark-700 shadow-sm mr-3">
            <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {isCompleted && (
            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center min-w-[44px] min-h-[44px] justify-center">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 dark:border-dark-600 overflow-visible">
          {children}
        </div>
      )}
    </div>
  )
}

export default function TaskModalNew({
  isOpen,
  onClose,
  onSuccess,
  task,
}: TaskModalNewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
  })

  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: null,
    status: 'pending',
    priority: 'medium',
    due_date: null,
    contact_id: null,
    deal_id: null,
  })

  // Reset form cuando cambia el modal
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          contact_id: task.contact_id,
          deal_id: task.deal_id,
        })
      } else {
        setFormData({
          title: '',
          description: null,
          status: 'pending',
          priority: 'medium',
          due_date: null,
          contact_id: null,
          deal_id: null,
        })
      }
      setExpandedSections({
        basic: true,
        details: false,
      })
      setValidationErrors([])
      setTouched(new Set())
      setError(null)
    }
  }, [task, isOpen])

  // Validaciones en tiempo real
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length < 2) return 'Título debe tener al menos 2 caracteres'
        if (value.length > 300) return 'Título demasiado largo (máx 300 caracteres)'
        return null

      default:
        return null
    }
  }

  // Validar todos los campos
  useEffect(() => {
    const errors: ValidationError[] = []

    // Solo validar campos que han sido tocados
    Array.from(touched).forEach((field) => {
      const value = formData[field as keyof TaskCreate]
      const errorMsg = validateField(field, value)
      if (errorMsg) {
        errors.push({ field, message: errorMsg })
      }
    })

    setValidationErrors(errors)
  }, [formData, touched])

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find((e) => e.field === field)?.message
  }

  const isFormValid = useMemo(() => {
    if (!formData.title || formData.title.trim().length < 2) return false
    if (validationErrors.length > 0) return false
    return true
  }, [formData, validationErrors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    setTouched(new Set(['title']))

    if (!isFormValid) {
      setError('Por favor corrige los errores antes de continuar')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (task) {
        await tasksService.update(task.id, formData as TaskUpdate)
      } else {
        await tasksService.create(formData)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar la tarea')
    } finally {
      setLoading(false)
    }
  }

  // Calcular completitud de secciones
  const isSectionComplete = (section: string): boolean => {
    switch (section) {
      case 'basic':
        return !!(formData.title && formData.title.length >= 2 && formData.status && formData.priority)
      case 'details':
        return !!(formData.due_date || formData.description)
      default:
        return false
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getDaysUntilDue = (): number | null => {
    if (!formData.due_date) return null
    const today = new Date()
    const due = new Date(formData.due_date)
    const diff = due.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getDueDateLabel = (): string => {
    const days = getDaysUntilDue()
    if (days === null) return 'Sin fecha'
    if (days < 0) return `Vencida hace ${Math.abs(days)} días`
    if (days === 0) return 'Vence hoy'
    if (days === 1) return 'Vence mañana'
    return `Vence en ${days} días`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Overlay con blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="relative inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle bg-white dark:bg-dark-900 shadow-2xl rounded-2xl"
            >
              {/* Header */}
              <div className="relative px-8 py-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-dark-700 rounded-xl shadow-md">
                      <CheckSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {task ? 'Editar Tarea' : 'Nueva Tarea'}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-300 text-sm mt-1">
                        {task
                          ? 'Actualiza la información de la tarea'
                          : 'Completa los datos para crear una nueva tarea'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="flex" style={{ minHeight: '500px' }}>
                {/* Sidebar con Preview */}
                <div className="w-80 bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-600 p-6 space-y-6">
                  {/* Preview Card */}
                  <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg">
                        <CheckSquare className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {formData.title || 'Nueva Tarea'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                        {StatusLabels[formData.status]}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Prioridad:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {PriorityLabels[formData.priority]}
                        </span>
                      </div>
                      {formData.due_date && (
                        <div className="pt-3 border-t border-gray-200 dark:border-dark-600">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-dark-200">
                            <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 dark:text-dark-400">Vencimiento</p>
                              <p className="font-medium">
                                {new Date(formData.due_date).toLocaleDateString('es-EC')}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                                {getDueDateLabel()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="bg-white dark:bg-dark-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        Completitud
                      </span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(
                          (Object.values(formData).filter(
                            (v) =>
                              v !== null &&
                              v !== '' &&
                              (Array.isArray(v) ? v.length > 0 : true)
                          ).length /
                            Object.keys(formData).length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (Object.values(formData).filter(
                              (v) =>
                                v !== null &&
                                v !== '' &&
                                (Array.isArray(v) ? v.length > 0 : true)
                            ).length /
                              Object.keys(formData).length) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Validation Summary */}
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-medium text-sm mb-2">
                        <AlertCircle className="w-4 h-4" />
                        Errores de validación
                      </div>
                      <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                        {validationErrors.map((err, idx) => (
                          <li key={idx}>• {err.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-white dark:bg-dark-900">
                  {/* Form Content */}
                  <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-red-800 dark:text-red-300 font-medium">{error}</span>
                        </div>
                      </div>
                    )}

                    {/* Section: Información Básica */}
                    <ExpandableSection
                      title="Información Básica"
                      icon={ListTodo}
                      isExpanded={expandedSections.basic}
                      onToggle={() => toggleSection('basic')}
                      isRequired={true}
                      isCompleted={isSectionComplete('basic')}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Título de la Tarea *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            onBlur={() => handleBlur('title')}
                            className={`w-full px-3 py-3 h-12 border rounded-lg transition-all bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 ${
                              getFieldError('title')
                                ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                            } shadow-sm`}
                            placeholder="Ej: Llamar al cliente sobre propuesta"
                          />
                          {getFieldError('title') && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {getFieldError('title')}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              Estado
                            </label>
                            <CustomDropdown
                              value={formData.status}
                              onChange={(value) =>
                                setFormData({ ...formData, status: value as TaskStatus })
                              }
                              options={STATUS_OPTIONS.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                              }))}
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              <Flag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              Prioridad
                            </label>
                            <CustomDropdown
                              value={formData.priority}
                              onChange={(value) =>
                                setFormData({ ...formData, priority: value as TaskPriority })
                              }
                              options={PRIORITY_OPTIONS.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                              }))}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Descripción
                          </label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value || null })
                            }
                            rows={4}
                            className="w-full px-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400"
                            placeholder="Describe la tarea, pasos a seguir, notas importantes..."
                          />
                        </div>
                      </div>
                    </ExpandableSection>

                    {/* Section: Detalles */}
                    <ExpandableSection
                      title="Detalles Adicionales"
                      icon={Calendar}
                      isExpanded={expandedSections.details}
                      onToggle={() => toggleSection('details')}
                      isCompleted={isSectionComplete('details')}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Fecha de Vencimiento
                          </label>
                          <input
                            type="date"
                            value={formData.due_date || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                due_date: e.target.value || null,
                              })
                            }
                            className="w-full px-3 py-3 h-12 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                          />
                          {formData.due_date && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-dark-300">
                              {getDueDateLabel()}
                            </p>
                          )}
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Tip:</strong> Establece una fecha de vencimiento para priorizar mejor tus tareas.
                          </p>
                        </div>
                      </div>
                    </ExpandableSection>
                  </form>

                  {/* Footer */}
                  <div className="px-8 py-6 bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-600 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
                      {!isFormValid && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4" />
                          Completa los campos requeridos
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-dark-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: loading || !isFormValid ? 1 : 1.05 }}
                        whileTap={{ scale: loading || !isFormValid ? 1 : 0.95 }}
                        onClick={handleSubmit}
                        disabled={loading || !isFormValid}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {task ? 'Actualizar Tarea' : 'Crear Tarea'}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
