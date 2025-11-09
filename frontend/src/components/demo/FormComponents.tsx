// frontend/src/components/demo/FormComponents.tsx
// Demostración de TODOS los componentes de formulario estilo Bitrix24

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Star,
  Tag,
  Clock,
  Calendar as CalendarIcon,
  ChevronDown,
  Search,
} from 'lucide-react'
import SelectDropdown from '@/components/ui/SelectDropdown'
import DatePicker from '@/components/ui/DatePicker'
import AnimatedButton from '@/components/ui/AnimatedButton'
import AnimatedCard from '@/components/ui/AnimatedCard'
import IconBadge from '@/components/ui/IconBadge'

export default function FormComponents() {
  // Estados de los formularios
  const [stage, setStage] = useState('desarrollo')
  const [priority, setPriority] = useState('alta')
  const [currency, setCurrency] = useState('usd')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [dateTime, setDateTime] = useState<Date | null>(new Date())

  // Opciones para los dropdowns
  const stageOptions = [
    {
      value: 'desarrollo',
      label: 'En desarrollo',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'Deal recién creado',
    },
    {
      value: 'calificacion',
      label: 'Calificación',
      icon: <Star className="w-4 h-4" />,
      description: 'Evaluando al prospecto',
    },
    {
      value: 'propuesta',
      label: 'Propuesta enviada',
      icon: <Mail className="w-4 h-4" />,
      description: 'Esperando respuesta',
    },
    {
      value: 'negociacion',
      label: 'Negociación',
      icon: <DollarSign className="w-4 h-4" />,
      description: 'Discutiendo términos',
    },
    {
      value: 'ganado',
      label: 'Ganado',
      icon: <Star className="w-4 h-4 text-green-600" />,
      description: 'Deal cerrado exitosamente',
    },
    {
      value: 'perdido',
      label: 'Perdido',
      icon: <Star className="w-4 h-4 text-red-600" />,
      description: 'No se concretó',
    },
  ]

  const priorityOptions = [
    {
      value: 'baja',
      label: 'Baja',
      icon: <Tag className="w-4 h-4 text-gray-600" />,
    },
    {
      value: 'media',
      label: 'Media',
      icon: <Tag className="w-4 h-4 text-blue-600" />,
    },
    {
      value: 'alta',
      label: 'Alta',
      icon: <Tag className="w-4 h-4 text-orange-600" />,
    },
    {
      value: 'urgente',
      label: 'Urgente',
      icon: <Tag className="w-4 h-4 text-red-600" />,
    },
  ]

  const currencyOptions = [
    { value: 'usd', label: 'Dólar US', icon: <span className="text-sm">$</span> },
    { value: 'eur', label: 'Euro', icon: <span className="text-sm">€</span> },
    { value: 'mxn', label: 'Peso Mexicano', icon: <span className="text-sm">$</span> },
    { value: 'cop', label: 'Peso Colombiano', icon: <span className="text-sm">$</span> },
  ]

  const industryOptions = [
    { value: 'tech', label: 'Tecnología', icon: <Building className="w-4 h-4" /> },
    { value: 'finance', label: 'Finanzas', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'retail', label: 'Retail', icon: <Building className="w-4 h-4" /> },
    { value: 'health', label: 'Salud', icon: <Building className="w-4 h-4" /> },
    { value: 'education', label: 'Educación', icon: <Building className="w-4 h-4" /> },
    { value: 'real_estate', label: 'Bienes Raíces', icon: <Building className="w-4 h-4" /> },
  ]

  const countryOptions = [
    { value: 'us', label: 'Estados Unidos', icon: <span className="text-sm">🇺🇸</span> },
    { value: 'mx', label: 'México', icon: <span className="text-sm">🇲🇽</span> },
    { value: 'co', label: 'Colombia', icon: <span className="text-sm">🇨🇴</span> },
    { value: 'ar', label: 'Argentina', icon: <span className="text-sm">🇦🇷</span> },
    { value: 'es', label: 'España', icon: <span className="text-sm">🇪🇸</span> },
    { value: 'fr', label: 'Francia', icon: <span className="text-sm">🇫🇷</span> },
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
            Componentes de Formulario - Estilo Bitrix24
          </h1>
          <p className="text-gray-600 text-lg">
            Dropdowns, Date Pickers y más con diseño profesional
          </p>
        </motion.div>

        {/* Sección 1: Dropdowns / Selects */}
        <AnimatedCard delay={0.1}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBadge icon={ChevronDown} variant="primary" size="lg" />
              <h2 className="text-2xl font-bold text-gray-900">
                Dropdowns / Selects (como Bitrix24)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dropdown simple */}
              <div>
                <SelectDropdown
                  label="Etapa del Deal"
                  options={stageOptions}
                  value={stage}
                  onChange={setStage}
                  placeholder="Selecciona una etapa"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con iconos y descripciones
                </p>
              </div>

              {/* Dropdown con prioridad */}
              <div>
                <SelectDropdown
                  label="Prioridad"
                  options={priorityOptions}
                  value={priority}
                  onChange={setPriority}
                  placeholder="Selecciona prioridad"
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con colores por prioridad
                </p>
              </div>

              {/* Dropdown de moneda */}
              <div>
                <SelectDropdown
                  label="Moneda"
                  options={currencyOptions}
                  value={currency}
                  onChange={setCurrency}
                  placeholder="Selecciona moneda"
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con símbolos de moneda
                </p>
              </div>

              {/* Dropdown searchable */}
              <div>
                <SelectDropdown
                  label="Industria"
                  options={industryOptions}
                  value={industry}
                  onChange={setIndustry}
                  placeholder="Buscar industria..."
                  searchable
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con búsqueda interna
                </p>
              </div>

              {/* Dropdown con emojis */}
              <div>
                <SelectDropdown
                  label="País"
                  options={countryOptions}
                  value={country}
                  onChange={setCountry}
                  placeholder="Selecciona país..."
                  searchable
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con banderas y búsqueda
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 2: Date Pickers / Calendarios */}
        <AnimatedCard delay={0.2}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBadge icon={CalendarIcon} variant="success" size="lg" />
              <h2 className="text-2xl font-bold text-gray-900">
                Date Pickers / Calendarios (como Bitrix24)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date picker simple */}
              <div>
                <DatePicker
                  label="Fecha de cierre"
                  selected={date}
                  onChange={setDate}
                  placeholder="Selecciona una fecha"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Header con gradiente azul
                </p>
              </div>

              {/* Date picker con hora */}
              <div>
                <DatePicker
                  label="Fecha y hora de reunión"
                  selected={dateTime}
                  onChange={setDateTime}
                  placeholder="Selecciona fecha y hora"
                  showTimeSelect
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con selector de hora
                </p>
              </div>

              {/* Date picker con mínimo */}
              <div>
                <DatePicker
                  label="Fecha mínima (hoy)"
                  selected={null}
                  onChange={() => {}}
                  placeholder="Solo fechas futuras"
                  minDate={new Date()}
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con fecha mínima
                </p>
              </div>

              {/* Date picker con máximo */}
              <div>
                <DatePicker
                  label="Fecha límite"
                  selected={null}
                  onChange={() => {}}
                  placeholder="Hasta fin de año"
                  maxDate={new Date(2025, 11, 31)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Con fecha máxima
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 3: Inputs Mejorados */}
        <AnimatedCard delay={0.3}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBadge icon={User} variant="purple" size="lg" />
              <h2 className="text-2xl font-bold text-gray-900">
                Inputs con Iconos (como Bitrix24)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input con icono izquierdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="+52 555 123 4567"
                  />
                </div>
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              {/* Valor con icono derecho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto del deal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="45000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    USD
                  </span>
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar cliente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400"
                    placeholder="Nombre, teléfono o email..."
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Sección 4: Textarea */}
        <AnimatedCard delay={0.4}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <IconBadge icon={Mail} variant="info" size="lg" />
              <h2 className="text-2xl font-bold text-gray-900">
                Textarea / Descripción (como Bitrix24)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del deal
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400 resize-none"
                  placeholder="Escribe los detalles del proyecto, requisitos especiales, notas importantes..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  ✨ Hover en border, focus ring azul, resize deshabilitado
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4">
          <AnimatedButton variant="primary" size="lg">
            Guardar Cambios
          </AnimatedButton>
          <AnimatedButton variant="secondary" size="lg">
            Cancelar
          </AnimatedButton>
        </div>
      </div>
    </div>
  )
}
