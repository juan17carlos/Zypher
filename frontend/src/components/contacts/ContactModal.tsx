// frontend/src/components/contacts/ContactModal.tsx - Modal ELABORADO y profesional

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Tag,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  Save,
  UserCircle2,
} from 'lucide-react'
import contactService from '@/services/contactsService'
import type { ContactOut, ContactCreate, ContactUpdate, IndustryTemplate } from '@/types/contact'
import { IndustryLabels, INDUSTRIES_OPTIONS } from '@/types/contact'
import SelectDropdown from '@/components/ui/SelectDropdown'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  contact?: ContactOut | null
}

type TabType = 'basic' | 'professional' | 'location' | 'additional'

interface ValidationError {
  field: string
  message: string
}

export default function ContactModal({
  isOpen,
  onClose,
  onSuccess,
  contact,
}: ContactModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('basic')
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState<ContactCreate>({
    full_name: '',
    email: null,
    phone: null,
    mobile: null,
    company: null,
    position: null,
    website: null,
    address: null,
    city: null,
    state: null,
    country: 'Ecuador',
    zip_code: null,
    industry_template: 'generic' as IndustryTemplate,
    custom_fields: {},
    tags: [],
    notes: null,
    is_active: true,
  })

  const [tagInput, setTagInput] = useState('')

  // Reset form cuando cambia el modal
  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          full_name: contact.full_name,
          email: contact.email,
          phone: contact.phone,
          mobile: contact.mobile,
          company: contact.company,
          position: contact.position,
          website: contact.website,
          address: contact.address,
          city: contact.city,
          state: contact.state,
          country: contact.country,
          zip_code: contact.zip_code,
          industry_template: contact.industry_template,
          custom_fields: contact.custom_fields || {},
          tags: contact.tags || [],
          notes: contact.notes,
          is_active: contact.is_active,
        })
      } else {
        setFormData({
          full_name: '',
          email: null,
          phone: null,
          mobile: null,
          company: null,
          position: null,
          website: null,
          address: null,
          city: null,
          state: null,
          country: 'Ecuador',
          zip_code: null,
          industry_template: 'generic' as IndustryTemplate,
          custom_fields: {},
          tags: [],
          notes: null,
          is_active: true,
        })
      }
      setActiveTab('basic')
      setValidationErrors([])
      setTouched(new Set())
      setError(null)
    }
  }, [contact, isOpen])

  // Validaciones en tiempo real
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'full_name':
        if (!value || value.trim().length < 2) return 'Nombre debe tener al menos 2 caracteres'
        if (value.length > 300) return 'Nombre demasiado largo (máx 300 caracteres)'
        return null

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Email inválido'
        return null

      case 'phone':
      case 'mobile':
        if (value && value.replace(/[^\d]/g, '').length < 7)
          return 'Teléfono debe tener al menos 7 dígitos'
        return null

      case 'website':
        if (value && !/^https?:\/\/.+\..+/.test(value))
          return 'URL inválida (debe incluir http:// o https://)'
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
      const value = formData[field as keyof ContactCreate]
      const errorMsg = validateField(field, value)
      if (errorMsg) {
        errors.push({ field, message: errorMsg })
      }
    })

    // Validación especial: debe tener al menos un método de contacto
    if (touched.has('email') || touched.has('phone') || touched.has('mobile')) {
      if (!formData.email && !formData.phone && !formData.mobile) {
        errors.push({
          field: 'contact_method',
          message: 'Debe proporcionar al menos un método de contacto (email, teléfono o móvil)',
        })
      }
    }

    setValidationErrors(errors)
  }, [formData, touched])

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find((e) => e.field === field)?.message
  }

  const isFormValid = useMemo(() => {
    // Validaciones básicas
    if (!formData.full_name || formData.full_name.trim().length < 2) return false
    if (!formData.email && !formData.phone && !formData.mobile) return false
    if (validationErrors.length > 0) return false
    return true
  }, [formData, validationErrors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    setTouched(
      new Set(['full_name', 'email', 'phone', 'mobile', 'website', 'company', 'position'])
    )

    if (!isFormValid) {
      setError('Por favor corrige los errores antes de continuar')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (contact) {
        await contactService.update(contact.id, formData as ContactUpdate)
      } else {
        await contactService.create(formData)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el contacto')
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

  // Generar iniciales para avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const tabs = [
    { id: 'basic' as TabType, label: 'Información Básica', icon: User },
    { id: 'professional' as TabType, label: 'Profesional', icon: Briefcase },
    { id: 'location' as TabType, label: 'Ubicación', icon: MapPin },
    { id: 'additional' as TabType, label: 'Adicional', icon: FileText },
  ]

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
              className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Container - MAS GRANDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="relative inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle bg-white shadow-2xl rounded-2xl"
            >
          {/* Header con fondo blanco */}
          <div className="relative px-8 py-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <UserCircle2 className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {contact
                      ? 'Actualiza la información del contacto'
                      : 'Completa los datos para crear un nuevo contacto'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          <div className="flex" style={{ minHeight: '600px' }}>
            {/* Sidebar con Preview */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold mb-4">
                    {formData.full_name ? getInitials(formData.full_name) : '?'}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {formData.full_name || 'Nuevo Contacto'}
                  </h4>
                  {formData.position && (
                    <p className="text-sm text-gray-600 mt-1">{formData.position}</p>
                  )}
                  {formData.company && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {formData.company}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  {formData.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{formData.email}</span>
                    </div>
                  )}
                  {(formData.phone || formData.mobile) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{formData.mobile || formData.phone}</span>
                    </div>
                  )}
                  {formData.city && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{formData.city}, {formData.country}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{formData.website}</span>
                    </div>
                  )}
                </div>

                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Industria</span>
                    <span className="font-medium text-gray-700">
                      {IndustryLabels[formData.industry_template]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completitud</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {Math.round(
                      (Object.values(formData).filter((v) => v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true))
                        .length /
                        Object.keys(formData).length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (Object.values(formData).filter((v) => v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true))
                          .length /
                          Object.keys(formData).length) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Validation Summary */}
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
                      <motion.button
                        key={tab.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </motion.button>
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
                        <User className="w-4 h-4 text-indigo-600" />
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        onBlur={() => handleBlur('full_name')}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          getFieldError('full_name')
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        }`}
                        placeholder="Ej: Juan Pérez García"
                      />
                      {getFieldError('full_name') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError('full_name')}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Mail className="w-4 h-4 text-indigo-600" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value || null })}
                          onBlur={() => handleBlur('email')}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            getFieldError('email')
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                          }`}
                          placeholder="ejemplo@email.com"
                        />
                        {getFieldError('email') && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Phone className="w-4 h-4 text-indigo-600" />
                          Teléfono Móvil
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value || null })}
                          onBlur={() => handleBlur('mobile')}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            getFieldError('mobile')
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                          }`}
                          placeholder="0987654321"
                        />
                        {getFieldError('mobile') && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('mobile')}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          Teléfono Fijo
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value || null })}
                          onBlur={() => handleBlur('phone')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="02-234-5678"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          Sitio Web
                        </label>
                        <input
                          type="url"
                          value={formData.website || ''}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value || null })}
                          onBlur={() => handleBlur('website')}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            getFieldError('website')
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                          }`}
                          placeholder="https://ejemplo.com"
                        />
                        {getFieldError('website') && (
                          <p className="mt-1 text-sm text-red-600">{getFieldError('website')}</p>
                        )}
                      </div>
                    </div>

                    {getFieldError('contact_method') && (
                      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                        <p className="text-amber-800 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {getFieldError('contact_method')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Professional */}
                {activeTab === 'professional' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          Empresa
                        </label>
                        <input
                          type="text"
                          value={formData.company || ''}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value || null })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Nombre de la empresa"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          Cargo
                        </label>
                        <input
                          type="text"
                          value={formData.position || ''}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value || null })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Ej: Gerente de Ventas"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        Industria
                      </label>
                      <SelectDropdown
                        value={formData.industry_template}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            industry_template: value as IndustryTemplate,
                          })
                        }
                        options={INDUSTRIES_OPTIONS.map((opt) => ({
                          value: opt.value,
                          label: opt.label,
                        }))}
                        placeholder="Selecciona una industria"
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> Selecciona la industria correcta para obtener campos
                        personalizados relevantes y mejores insights.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: Location */}
                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value || null })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Calle principal y secundaria"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value || null })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Quito"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Estado/Provincia
                        </label>
                        <input
                          type="text"
                          value={formData.state || ''}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value || null })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Pichincha"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={formData.zip_code || ''}
                          onChange={(e) => setFormData({ ...formData, zip_code: e.target.value || null })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="170123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        País
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ecuador"
                      />
                    </div>
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
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddTag}
                          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                        >
                          Agregar
                        </motion.button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags && formData.tags.length > 0 ? (
                          formData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
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

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Notas
                      </label>
                      <textarea
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Notas adicionales sobre el contacto..."
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="is_active" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                        <Check className="w-4 h-4 text-green-600" />
                        Contacto activo
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
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: loading || !isFormValid ? 1 : 1.05 }}
                    whileTap={{ scale: loading || !isFormValid ? 1 : 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {contact ? 'Actualizar Contacto' : 'Crear Contacto'}
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
