// frontend/src/components/tasks/TaskModal.tsx - Modal profesional para Tasks

import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  CheckCircle2,
  User,
  Briefcase,
  FileText,
  Clock,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import contactsService from '@/services/contactsService'
import dealsService from '@/services/dealsService'
import type { TaskOut, TaskCreate, TaskUpdate } from '@/types/task'
import type { ContactOut } from '@/types/contact'
import type { DealOut } from '@/types/deal'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/types/task'

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
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
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
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
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange('priority', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                    >
                      {PRIORITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fecha de vencimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="datetime-local"
                    value={formData.due_date ? formData.due_date.slice(0, 16) : ''}
                    onChange={(e) => handleChange('due_date', e.target.value || null)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Relacionar con Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto Relacionado
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={formData.contact_id || ''}
                    onChange={(e) =>
                      handleChange('contact_id', e.target.value ? parseInt(e.target.value) : null)
                    }
                    disabled={loadingContacts}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white disabled:bg-gray-50"
                  >
                    <option value="">Sin contacto</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.full_name} {contact.company ? `- ${contact.company}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Relacionar con Deal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Relacionado
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={formData.deal_id || ''}
                    onChange={(e) =>
                      handleChange('deal_id', e.target.value ? parseInt(e.target.value) : null)
                    }
                    disabled={loadingDeals}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white disabled:bg-gray-50"
                  >
                    <option value="">Sin deal</option>
                    {deals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.title} - ${deal.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <p className="text-sm text-gray-500">* Campos obligatorios</p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
