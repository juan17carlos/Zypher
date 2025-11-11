// frontend/src/components/deals/DealModalNew.tsx - Modal con diseño Facturación Pro

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Briefcase,
  DollarSign,
  Target,
  Tag,
  FileText,
  AlertCircle,
  Loader2,
  Save,
  TrendingUp,
  Calendar,
  User,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import dealsService from '@/services/dealsService'
import contactsService from '@/services/contactsService'
import type { DealOut, DealCreate, DealUpdate, DealStage, DealPriority, DealSource } from '@/types/deal'
import type { ContactOut } from '@/types/contact'
import type { DealProduct } from '@/types/product'
import {
  STAGE_OPTIONS,
  PRIORITY_OPTIONS,
  SOURCE_OPTIONS,
  StageProbabilities,
  StageLabels,
  PriorityLabels,
} from '@/types/deal'
import CustomDropdown from '@/components/ui/CustomDropdown'
import DealProductsSection from '@/components/deals/DealProductsSection'
import QuotationPreview from '@/components/deals/QuotationPreview'
import { Package, Eye } from 'lucide-react'

interface DealModalNewProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  deal?: DealOut | null
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

export default function DealModalNew({
  isOpen,
  onClose,
  onSuccess,
  deal,
}: DealModalNewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [contacts, setContacts] = useState<ContactOut[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    financial: false,
    products: false,
    details: false,
    additional: false,
  })

  // Estado para productos del deal (para cotizaciones)
  const [dealProducts, setDealProducts] = useState<DealProduct[]>([])
  const [showQuotationPreview, setShowQuotationPreview] = useState(false)

  const [formData, setFormData] = useState<DealCreate>({
    title: '',
    description: null,
    value: 0,
    currency: 'USD',
    stage: 'LEAD',
    probability: 10,
    priority: 'MEDIUM',
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
      const response = await contactsService.getAllWithPagination({ page_size: 100 })
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
          stage: 'LEAD',
          probability: 10,
          priority: 'MEDIUM',
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
      setExpandedSections({
        basic: true,
        financial: false,
        products: false,
        details: false,
        additional: false,
      })
      setDealProducts([]) // Reset products cuando se cierra el modal
      setValidationErrors([])
      setTouched(new Set())
      setError(null)
    }
  }, [deal, isOpen])

  // Validaciones en tiempo real
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length < 2) return 'Título debe tener al menos 2 caracteres'
        if (value.length > 300) return 'Título demasiado largo (máx 300 caracteres)'
        return null

      case 'value':
        if (value < 0) return 'El valor no puede ser negativo'
        return null

      case 'contact_id':
        if (!value) return 'Debe seleccionar un contacto'
        return null

      case 'probability':
        if (value < 0 || value > 100) return 'Probabilidad debe estar entre 0 y 100'
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

    // Marcar todos los campos como tocados
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

  // Actualizar probabilidad cuando cambia el stage
  const handleStageChange = (newStage: string) => {
    const stage = newStage as DealStage
    setFormData({
      ...formData,
      stage,
      probability: StageProbabilities[stage],
    })
  }

  // Calcular completitud de secciones
  const isSectionComplete = (section: string): boolean => {
    switch (section) {
      case 'basic':
        return !!(formData.title && formData.title.length >= 2 && formData.contact_id)
      case 'financial':
        return !!(formData.value >= 0 && formData.stage && formData.probability >= 0)
      case 'details':
        return !!(formData.priority && (formData.source || formData.expected_close_date))
      case 'additional':
        return !!(formData.tags && formData.tags.length > 0) || !!formData.description
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: formData.currency,
    }).format(value)
  }

  const getContactName = () => {
    const contact = contacts.find((c) => c.id === formData.contact_id)
    return contact ? contact.full_name : 'Sin contacto'
  }

  if (!isOpen) return null

  return (
    <>
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
              className="relative inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle bg-white dark:bg-dark-900 shadow-2xl rounded-2xl"
            >
              {/* Header */}
              <div className="relative px-8 py-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-dark-700 rounded-xl shadow-md">
                      <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {deal ? 'Editar Deal' : 'Nuevo Deal'}
                      </h3>
                      <p className="text-gray-600 dark:text-dark-300 text-sm mt-1">
                        {deal
                          ? 'Actualiza la información del deal'
                          : 'Completa los datos para crear un nuevo deal'}
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

              <div className="flex" style={{ minHeight: '600px' }}>
                {/* Sidebar con Preview */}
                <div className="w-80 bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-600 p-6 space-y-6">
                  {/* Preview Card */}
                  <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg">
                        <TrendingUp className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {formData.title || 'Nuevo Deal'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">
                        {StageLabels[formData.stage]}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Valor:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(formData.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Probabilidad:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {formData.probability}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-dark-400">Prioridad:</span>
                        <span className="font-medium text-gray-700 dark:text-dark-200">
                          {PriorityLabels[formData.priority]}
                        </span>
                      </div>
                      {formData.contact_id && (
                        <div className="pt-3 border-t border-gray-200 dark:border-dark-600">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-dark-200">
                            <User className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                            <span className="truncate">{getContactName()}</span>
                          </div>
                        </div>
                      )}
                      {formData.expected_close_date && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-dark-200">
                          <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          <span>
                            {new Date(formData.expected_close_date).toLocaleDateString('es-EC')}
                          </span>
                        </div>
                      )}
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                              v !== 0 &&
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
                                v !== 0 &&
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
                      icon={Briefcase}
                      isExpanded={expandedSections.basic}
                      onToggle={() => toggleSection('basic')}
                      isRequired={true}
                      isCompleted={isSectionComplete('basic')}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Título del Deal *
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
                            placeholder="Ej: Venta de Software CRM"
                          />
                          {getFieldError('title') && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {getFieldError('title')}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Contacto *
                          </label>
                          <CustomDropdown
                            value={formData.contact_id}
                            onChange={(value) => setFormData({ ...formData, contact_id: value })}
                            options={contacts.map((contact) => ({
                              value: contact.id,
                              label: `${contact.full_name}${contact.company ? ` - ${contact.company}` : ''}`,
                            }))}
                            placeholder={loadingContacts ? 'Cargando contactos...' : 'Selecciona un contacto'}
                            disabled={loadingContacts}
                          />
                          {getFieldError('contact_id') && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {getFieldError('contact_id')}
                            </p>
                          )}
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
                            placeholder="Describe el deal, objetivos, notas importantes..."
                          />
                        </div>
                      </div>
                    </ExpandableSection>

                    {/* Section: Información Financiera */}
                    <ExpandableSection
                      title="Información Financiera"
                      icon={DollarSign}
                      isExpanded={expandedSections.financial}
                      onToggle={() => toggleSection('financial')}
                      isRequired={true}
                      isCompleted={isSectionComplete('financial')}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              Valor del Deal *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              required
                              value={formData.value}
                              onChange={(e) =>
                                setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                              }
                              onBlur={() => handleBlur('value')}
                              className={`w-full px-3 py-3 h-12 border rounded-lg transition-all bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 ${
                                getFieldError('value')
                                  ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500 focus:border-red-500'
                                  : 'border-gray-300 dark:border-dark-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                              } shadow-sm`}
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Moneda
                            </label>
                            <CustomDropdown
                              value={formData.currency}
                              onChange={(value) => setFormData({ ...formData, currency: value })}
                              options={[
                                { value: 'USD', label: 'USD - Dólar' },
                                { value: 'EUR', label: 'EUR - Euro' },
                                { value: 'COP', label: 'COP - Peso Colombiano' },
                              ]}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Etapa del Deal
                          </label>
                          <CustomDropdown
                            value={formData.stage}
                            onChange={handleStageChange}
                            options={STAGE_OPTIONS.map((opt) => ({
                              value: opt.value,
                              label: opt.label,
                            }))}
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Probabilidad de Cierre: {formData.probability}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={formData.probability}
                            onChange={(e) =>
                              setFormData({ ...formData, probability: parseInt(e.target.value) })
                            }
                            className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-dark-400 mt-1">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </ExpandableSection>

                    {/* Section: Productos (para cotizaciones) */}
                    <ExpandableSection
                      title="Productos / Cotización"
                      icon={Package}
                      isExpanded={expandedSections.products}
                      onToggle={() => toggleSection('products')}
                      isCompleted={dealProducts.length > 0}
                    >
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-medium mb-1">💡 Funcionalidad de Cotizaciones</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                          Agrega productos a este deal para generar cotizaciones.
                          Los productos agregados se guardarán cuando conectes al backend.
                          {/* TODO: Conectar con API de productos y deal_products cuando el backend esté listo */}
                        </p>
                      </div>
                      <DealProductsSection
                        products={dealProducts}
                        onChange={setDealProducts}
                      />
                    </ExpandableSection>

                    {/* Section: Detalles */}
                    <ExpandableSection
                      title="Detalles"
                      icon={Target}
                      isExpanded={expandedSections.details}
                      onToggle={() => toggleSection('details')}
                      isCompleted={isSectionComplete('details')}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Prioridad
                            </label>
                            <CustomDropdown
                              value={formData.priority}
                              onChange={(value) =>
                                setFormData({ ...formData, priority: value as DealPriority })
                              }
                              options={PRIORITY_OPTIONS.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                              }))}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                              Fuente
                            </label>
                            <CustomDropdown
                              value={formData.source || 'OTHER'}
                              onChange={(value) =>
                                setFormData({
                                  ...formData,
                                  source: value !== 'OTHER' ? (value as DealSource) : null,
                                })
                              }
                              options={SOURCE_OPTIONS.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                              }))}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Fecha Esperada de Cierre
                          </label>
                          <input
                            type="date"
                            value={formData.expected_close_date || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expected_close_date: e.target.value || null,
                              })
                            }
                            className="w-full px-3 py-3 h-12 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </ExpandableSection>

                    {/* Section: Adicional */}
                    <ExpandableSection
                      title="Información Adicional"
                      icon={Tag}
                      isExpanded={expandedSections.additional}
                      onToggle={() => toggleSection('additional')}
                      isCompleted={isSectionComplete('additional')}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
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
                              className="flex-1 px-3 py-3 h-12 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400"
                              placeholder="Escribe un tag y presiona Enter"
                            />
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAddTag}
                              className="px-6 py-3 h-12 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                            >
                              Agregar
                            </motion.button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.tags && formData.tags.length > 0 ? (
                              formData.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
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
                              <p className="text-sm text-gray-500 dark:text-dark-400 italic">
                                No hay tags agregados
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) =>
                              setFormData({ ...formData, is_active: e.target.checked })
                            }
                            className="w-5 h-5 text-purple-600 border-gray-300 dark:border-dark-600 rounded focus:ring-purple-500"
                          />
                          <label
                            htmlFor="is_active"
                            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                          >
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                            Deal activo
                          </label>
                        </div>
                      </div>
                    </ExpandableSection>
                  </form>

                  {/* Footer */}
                  <div className="px-8 py-6 bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
                        {!isFormValid && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4" />
                            Completa los campos requeridos
                          </span>
                        )}
                      </div>

                      {/* Botón Ver Cotización (solo visible con productos) */}
                      {dealProducts.length > 0 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowQuotationPreview(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Cotización ({dealProducts.length}{' '}
                          {dealProducts.length === 1 ? 'producto' : 'productos'})
                        </motion.button>
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
                            {deal ? 'Actualizar Deal' : 'Crear Deal'}
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

    {/* Quotation Preview Modal */}
    <QuotationPreview
      isOpen={showQuotationPreview}
      onClose={() => setShowQuotationPreview(false)}
      dealTitle={formData.title || 'Cotización'}
      contactName={getContactName()}
      contactEmail={contacts.find((c) => c.id === formData.contact_id)?.email}
      contactPhone={contacts.find((c) => c.id === formData.contact_id)?.phone}
      contactCompany={contacts.find((c) => c.id === formData.contact_id)?.company || undefined}
      products={dealProducts}
      notes={formData.description || undefined}
    />
  </>
  )
}
