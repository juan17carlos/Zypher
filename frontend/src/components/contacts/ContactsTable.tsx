// frontend/src/components/contacts/ContactsTable.tsx - Tabla profesional de contactos con filtros

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
} from 'lucide-react'
import contactService from '@/services/contactsService'
import type { ContactOut, ContactsQueryParams, IndustryTemplate } from '@/types/contact'
import { IndustryLabels, INDUSTRIES_OPTIONS } from '@/types/contact'

interface ContactsTableProps {
  onContactClick?: (contact: ContactOut) => void
  onEditClick?: (contact: ContactOut) => void
  onDeleteClick?: (contact: ContactOut) => void
  onCreateClick?: () => void
}

export default function ContactsTable({
  onContactClick,
  onEditClick,
  onDeleteClick,
  onCreateClick,
}: ContactsTableProps) {
  const [contacts, setContacts] = useState<ContactOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContacts, setTotalContacts] = useState(0)
  const [pageSize, setPageSize] = useState(50)

  // Filtros
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Ordenamiento
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Menu contextual
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Cargar contactos
  useEffect(() => {
    loadContacts()
  }, [currentPage, pageSize, search, industryFilter, countryFilter, statusFilter, sortBy, sortOrder])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: ContactsQueryParams = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      }

      if (search) params.search = search
      if (industryFilter && industryFilter !== 'all') params.industry = industryFilter as IndustryTemplate
      if (countryFilter) params.country = countryFilter
      if (statusFilter !== 'all') params.is_active = statusFilter === 'active'

      const response = await contactService.getAllWithPagination(params)

      setContacts(response.items)
      setTotalContacts(response.total)
      setTotalPages(response.pages)
    } catch (err: any) {
      setError(err.message || 'Error cargando contactos')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const blob = await contactService.exportToCSV({
        industry: industryFilter !== 'all' ? (industryFilter as IndustryTemplate) : undefined,
        country: countryFilter || undefined,
        is_active: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
      })

      // Descargar archivo
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contactos_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      alert(err.message || 'Error exportando contactos')
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contactos</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalContacts} contacto{totalContacts !== 1 ? 's' : ''} en total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>

            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Contacto
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, empresa, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
              showFilters
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industria
              </label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todas las industrias</option>
                {INDUSTRIES_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                type="text"
                placeholder="Filtrar por país"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={loadContacts}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Building2 className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No hay contactos</p>
            <p className="text-sm mt-1">Crea tu primer contacto para comenzar</p>
            <button
              onClick={onCreateClick}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Crear Contacto
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('full_name')}
                    className="text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900"
                  >
                    Contacto
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Información de Contacto
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('company')}
                    className="text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900"
                  >
                    Empresa
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Industria
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tags
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onContactClick?.(contact)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-semibold text-sm">
                          {contact.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.position || 'Sin cargo'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {contact.email}
                        </div>
                      )}
                      {(contact.phone || contact.mobile) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {contact.mobile || contact.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{contact.company || '-'}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {contact.city || contact.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {IndustryLabels[contact.industry_template as IndustryTemplate]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags && contact.tags.length > 0 ? (
                        contact.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                      {contact.tags && contact.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{contact.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenu(activeMenu === contact.id ? null : contact.id)
                        }}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {activeMenu === contact.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenu(null)
                                onContactClick?.(contact)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4 mr-3" />
                              Ver Detalle
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenu(null)
                                onEditClick?.(contact)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit2 className="w-4 h-4 mr-3" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenu(null)
                                onDeleteClick?.(contact)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {!loading && contacts.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalContacts)}
            </span>{' '}
            de <span className="font-medium">{totalContacts}</span> contactos
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <span className="px-4 py-2 text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
