// frontend/src/components/deals/DealModal.tsx - Modal ELABORADO para Deal (Phase 3)

import { useState, useEffect, useMemo } from 'react'
import {
  X,
  DollarSign,
  Calendar,
  TrendingUp,
  Tag,
  FileText,
  AlertCircle,
  Loader2,
  Save,
  Briefcase,
  Target,
  User,
} from 'lucide-react'
import dealsService from '@/services/dealsService'
import contactsService from '@/services/contactsService'
import type { DealOut, DealCreate, DealUpdate } from '@/types/deal'
import type { ContactOut } from '@/types/contact'
import {
  STAGE_OPTIONS,
  PRIORITY_OPTIONS,
  SOURCE_OPTIONS,
  StageProbabilities,
} from '@/types/deal'

interface DealModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deal?: DealOut | null
}

type TabType = 'basic' | 'financial' | 'additional'

interface ValidationError {
  field: string
  message: string
}

export default function DealModal({ isOpen, onClose, onSuccess, deal }: DealModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [contacts, setContacts] = useState<ContactOut[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)

  const [formData, setFormData] = useState<DealCreate>({
    title: '',
    description: null,
    value: 0,
    currency: 'USD',
    stage: 'lead',
    probability: 10,
    priority: 'medium',
    source: null,
    expected_close_date: null,
    actual_close_date: null,
    lost_reason: null,
    tags: [],
    custom_fields: {},
    is_active: true,
    contact_id: '',
  })

  const [tagInput, setTagInput] = useState('')

  // Cargar contactos
  useEffect(() => {
    if (isOpen) {
      loadContacts()
    }
  }, [isOpen])

  const loadContacts = async () => {
    try {
      setLoadingContacts(true)
      const response = await contactsService.getAllWithPagination({ limit: 100 })
      setContacts(response.items)
    } catch (err) {
      console.error('Error loading contacts:', err)
    } finally {
      setLoadingContacts(false)
    }
  }

  // Reset form cuando cambia el modal
  useEffect(() => {
    if (isOpen) {
      if (deal) {
        setFormData({
          title: deal.title,
          description: deal.description,
          value: deal.value,
          currency: deal.currency,
          stage: deal.stage,
          probability: deal.probability,
          priority: deal.priority,
          source: deal.source,
          expected_close_date: deal.expected_close_date,
          actual_close_date: deal.actual_close_date,
          lost_reason: deal.lost_reason,
          tags: deal.tags || [],
          custom_fields: deal.custom_fields || {},
          is_active: deal.is_active,
          contact_id: deal.contact_id,
        })
      } else {
        setFormData({
          title: '',
          description: null,
          value: 0,
          currency: 'USD',
          stage: 'lead',
          probability: 10,
          priority: 'medium',
          source: null,
          expected_close_date: null,
          actual_close_date: null,
          lost_reason: null,
          tags: [],
          custom_fields: {},
          is_active: true,
          contact_id: '',
        })
      }
      setActiveTab('basic')
      setValidationErrors([])
      setTouched(new Set())
      setError(null)
    }
  }, [deal, isOpen])

  // Validaciones
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length < 2) return 'Título debe tener al menos 2 caracteres'
        if (value.length > 300) return 'Título demasiado largo (máx 300 caracteres)'
        return null

      case 'value':
        if (value < 0) return 'El valor no puede ser negativo'
        return null

      case 'probability':
        if (value < 0 || value > 100) return 'La probabilidad debe estar entre 0 y 100'
        return null

      case 'contact_id':
        if (!value) return 'Debes seleccionar un contacto'
        return null

      default:
        return null
    }
  }

  // Validar todos los campos
  useEffect(() => {
    const errors: ValidationError[] = []

    Array.from(touched).forEach((field) => {
      const value = formData[field as keyof DealCreate]
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
    if (!formData.contact_id) return false
    if (formData.value < 0) return false
    if (formData.probability < 0 || formData.probability > 100) return false
    if (validationErrors.length > 0) return false
    return true
  }, [formData, validationErrors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched(new Set(['title', 'contact_id', 'value', 'probability']))

    if (!isFormValid) {
      setError('Por favor corrige los errores antes de continuar')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (deal) {
        await dealsService.update(deal.id, formData as DealUpdate)
      } else {
        await dealsService.create(formData)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el deal')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    })
  }

  // Auto-ajustar probabilidad según etapa
  const handleStageChange = (stage: string) => {
    setFormData({
      ...formData,
      stage: stage as any,
      probability: StageProbabilities[stage as keyof typeof StageProbabilities] || formData.probability,
    })
  }

  const tabs = [
    { id: 'basic' as TabType, label: 'Información Básica', icon: Briefcase },
    { id: 'financial' as TabType, label: 'Financiero', icon: DollarSign },
    { id: 'additional' as TabType, label: 'Adicional', icon: FileText },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="relative inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="relative px-8 py-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {deal ? 'Editar Deal' : 'Nuevo Deal'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {deal
                      ? 'Actualiza la información del deal'
                      : 'Completa los datos para crear un nuevo deal'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex" style={{ minHeight: '500px' }}>
            {/* Sidebar Preview */}
            <div className="w-72 bg-gray-50 border-r border-gray-200 p-6 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-3">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900">{formData.title || 'Nuevo Deal'}</h4>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    {dealsService.formatCurrency(formData.value, formData.currency)}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Etapa:</span>
                    <span className="font-medium text-gray-900">
                      {STAGE_OPTIONS.find((s) => s.value === formData.stage)?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Probabilidad:</span>
                    <span className="font-bold text-indigo-600">{formData.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prioridad:</span>
                    <span className="font-medium text-gray-900">
                      {PRIORITY_OPTIONS.find((p) => p.value === formData.priority)?.label}
                    </span>
                  </div>
                </div>

                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800 font-medium text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Errores de validación
                  </div>
                  <ul className="text-xs text-red-700 space-y-1">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>• {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="border-b border-gray-200 bg-white px-8 pt-6">
                <nav className="flex gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-800 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Tab: Basic */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        Título del Deal *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onBlur={() => handleBlur('title')}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          getFieldError('title')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        }`}
                        placeholder="Ej: Venta Software CRM a Empresa XYZ"
                      />
                      {getFieldError('title') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError('title')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Contacto *
                      </label>
                      <select
                        required
                        value={formData.contact_id}
                        onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                        onBlur={() => handleBlur('contact_id')}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          getFieldError('contact_id')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        }`}
                        disabled={loadingContacts}
                      >
                        <option value="">Selecciona un contacto</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.full_name} {contact.company ? `- ${contact.company}` : ''}
                          </option>
                        ))}
                      </select>
                      {getFieldError('contact_id') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('contact_id')}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <TrendingUp className="w-4 h-4 text-indigo-600" />
                          Etapa del Pipeline
                        </label>
                        <select
                          value={formData.stage}
                          onChange={(e) => handleStageChange(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {STAGE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Target className="w-4 h-4 text-indigo-600" />
                          Probabilidad (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.probability}
                          onChange={(e) =>
                            setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })
                          }
                          onBlur={() => handleBlur('probability')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Prioridad
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData({ ...formData, priority: e.target.value as any })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Fuente de Origen
                        </label>
                        <select
                          value={formData.source || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, source: e.target.value as any || null })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Selecciona una fuente</option>
                          {SOURCE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value || null })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Describe el deal y las necesidades del cliente..."
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Financial */}
                {activeTab === 'financial' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <DollarSign className="w-4 h-4 text-indigo-600" />
                          Valor del Deal
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.value}
                          onChange={(e) =>
                            setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                          }
                          onBlur={() => handleBlur('value')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Moneda
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Fecha Estimada de Cierre
                      </label>
                      <input
                        type="date"
                        value={formData.expected_close_date || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, expected_close_date: e.target.value || null })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {(formData.stage === 'lost' || formData.stage === 'won') && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Fecha Real de Cierre
                        </label>
                        <input
                          type="date"
                          value={formData.actual_close_date || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, actual_close_date: e.target.value || null })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {formData.stage === 'lost' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Motivo de Pérdida
                        </label>
                        <textarea
                          value={formData.lost_reason || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, lost_reason: e.target.value || null })
                          }
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="¿Por qué se perdió este deal?"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Additional */}
                {activeTab === 'additional' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        Tags
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Escribe un tag y presiona Enter"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags && formData.tags.length > 0 ? (
                          formData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No hay tags agregados</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="is_active"
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        Deal activo
                      </label>
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {!isFormValid && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      Completa los campos requeridos
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {deal ? 'Actualizar Deal' : 'Crear Deal'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
