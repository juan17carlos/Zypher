// frontend/src/components/tasks/TaskModal.tsx - Modal profesional para Tasks

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  AlertCircle,
  Loader2,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import contactsService from '@/services/contactsService'
import dealsService from '@/services/dealsService'
import type { TaskOut, TaskCreate, TaskUpdate } from '@/types/task'
import type { ContactOut } from '@/types/contact'
import type { DealOut } from '@/types/deal'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/types/task'
import SelectDropdown from '@/components/ui/SelectDropdown'
import DatePicker from '@/components/ui/DatePicker'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  task?: TaskOut | null
  preselectedContactId?: number
  preselectedDealId?: number
}

interface ValidationError {
  field: string
  message: string
}

export default function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  task,
  preselectedContactId,
  preselectedDealId,
}: TaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const [contacts, setContacts] = useState<ContactOut[]>([])
  const [deals, setDeals] = useState<DealOut[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingDeals, setLoadingDeals] = useState(false)

  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: null,
    status: 'pending',
    priority: 'medium',
    due_date: null,
    contact_id: preselectedContactId || null,
    deal_id: preselectedDealId || null,
  })

  // Cargar datos relacionados
  useEffect(() => {
    if (isOpen) {
      loadContacts()
      loadDeals()
    }
  }, [isOpen])

  const loadContacts = async () => {
    try {
      setLoadingContacts(true)
      const response = await contactsService.getAllWithPagination({
        limit: 100,
        is_active: true,
      })
      setContacts(response.items)
    } catch (err) {
      console.error('Error loading contacts:', err)
    } finally {
      setLoadingContacts(false)
    }
  }

  const loadDeals = async () => {
    try {
      setLoadingDeals(true)
      const response = await dealsService.getAllWithPagination({
        page_size: 100,
        is_active: true,
      })
      setDeals(response.items)
    } catch (err) {
      console.error('Error loading deals:', err)
    } finally {
      setLoadingDeals(false)
    }
  }

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
          contact_id: preselectedContactId || null,
          deal_id: preselectedDealId || null,
        })
      }
      setValidationErrors([])
      setTouched(new Set())
      setError(null)
    }
  }, [task, isOpen, preselectedContactId, preselectedDealId])

  // Validaciones
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

    setTouched(new Set(['title']))

    if (!isFormValid) {
      setError('Por favor corrige los errores antes de guardar')
      return
    }

    try {
      setLoading(true)
      setError(null)

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

  const handleChange = (field: keyof TaskCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {task ? 'Editar Tarea' : 'Nueva Tarea'}
                  </h3>
                  <p className="text-sm text-indigo-100 mt-0.5">
                    {task ? 'Actualiza la información de la tarea' : 'Crea una nueva tarea'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6">
              {/* Error general */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800">Error</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Tarea *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    placeholder="Ej: Llamar al cliente"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      getFieldError('title')
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {getFieldError('title') && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {getFieldError('title')}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value || null)}
                  placeholder="Detalles adicionales sobre la tarea..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Estado y Prioridad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <SelectDropdown
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                    options={STATUS_OPTIONS.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    placeholder="Selecciona estado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <SelectDropdown
                    value={formData.priority}
                    onChange={(value) => handleChange('priority', value)}
                    options={PRIORITY_OPTIONS.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    placeholder="Selecciona prioridad"
                  />
                </div>
              </div>

              {/* Fecha de vencimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <DatePicker
                  selected={formData.due_date ? new Date(formData.due_date) : null}
                  onChange={(date) =>
                    handleChange('due_date', date ? date.toISOString() : null)
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  placeholder="Selecciona fecha y hora"
                />
              </div>

              {/* Relacionar con Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto Relacionado
                </label>
                <SelectDropdown
                  value={formData.contact_id?.toString() || ''}
                  onChange={(value) =>
                    handleChange('contact_id', value ? parseInt(value) : null)
                  }
                  options={[
                    { value: '', label: 'Sin contacto' },
                    ...contacts.map((contact) => ({
                      value: contact.id.toString(),
                      label: contact.full_name,
                      description: contact.company || undefined,
                    })),
                  ]}
                  placeholder="Selecciona un contacto"
                  disabled={loadingContacts}
                  searchable
                />
              </div>

              {/* Relacionar con Deal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Relacionado
                </label>
                <SelectDropdown
                  value={formData.deal_id?.toString() || ''}
                  onChange={(value) =>
                    handleChange('deal_id', value ? parseInt(value) : null)
                  }
                  options={[
                    { value: '', label: 'Sin deal' },
                    ...deals.map((deal) => ({
                      value: deal.id.toString(),
                      label: deal.title,
                      description: `$${deal.value}`,
                    })),
                  ]}
                  placeholder="Selecciona un deal"
                  disabled={loadingDeals}
                  searchable
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <p className="text-sm text-gray-500">* Campos obligatorios</p>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: loading || !isFormValid ? 1 : 1.05 }}
                  whileTap={{ scale: loading || !isFormValid ? 1 : 0.95 }}
                  disabled={loading || !isFormValid}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {task ? 'Actualizar' : 'Crear'} Tarea
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
      )}
    </AnimatePresence>
  )
}
