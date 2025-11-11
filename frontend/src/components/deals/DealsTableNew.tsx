// frontend/src/components/deals/DealsTableNew.tsx - Tabla de Deals con diseño Facturación Pro

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Award,
  XCircle,
  Briefcase,
  Calendar,
  Target,
} from 'lucide-react'
import dealsService from '@/services/dealsService'
import type { DealOut, DealStage, DealPriority, DealSource } from '@/types/deal'
import { StageLabels, PriorityLabels, SourceLabels, StageColors, PriorityColors } from '@/types/deal'
import CustomDropdown from '@/components/ui/CustomDropdown'

interface DealsTableNewProps {
  onDealClick?: (deal: DealOut) => void
  onEditClick?: (deal: DealOut) => void
  onDeleteClick?: (deal: DealOut) => void
  onCreateClick?: () => void
}

interface StatsData {
  total_deals: number
  total_value: number
  won_deals: number
  lost_deals: number
}

export default function DealsTableNew({
  onDealClick,
  onEditClick,
  onDeleteClick,
  onCreateClick,
}: DealsTableNewProps) {
  const [deals, setDeals] = useState<DealOut[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData>({
    total_deals: 0,
    total_value: 0,
    won_deals: 0,
    lost_deals: 0,
  })

  // Filtros
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  // Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 10

  // Cargar deals
  useEffect(() => {
    loadDeals()
  }, [page, search, stageFilter, priorityFilter, sourceFilter])

  // Cargar stats
  useEffect(() => {
    loadStats()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      const response = await dealsService.getAllWithPagination({
        page,
        page_size: pageSize,
        search: search || undefined,
        stage: stageFilter !== 'all' ? (stageFilter as DealStage) : undefined,
        priority: priorityFilter !== 'all' ? (priorityFilter as DealPriority) : undefined,
        source: sourceFilter !== 'all' ? (sourceFilter as DealSource) : undefined,
      })
      setDeals(response.items)
      setTotalPages(response.total_pages)
      setTotalItems(response.total)
    } catch (error) {
      console.error('Error loading deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await dealsService.getStats()
      setStats({
        total_deals: statsData.total_deals,
        total_value: statsData.total_value,
        won_deals: statsData.won_deals,
        lost_deals: statsData.lost_deals,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStageColor = (stage: DealStage) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[StageColors[stage] as keyof typeof colors] || colors.gray
  }

  const getPriorityColor = (priority: DealPriority) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[PriorityColors[priority] as keyof typeof colors] || colors.gray
  }

  const handleDelete = async (deal: DealOut) => {
    if (window.confirm(`¿Estás seguro de eliminar el deal "${deal.title}"?`)) {
      try {
        await dealsService.delete(deal.id)
        loadDeals()
        loadStats()
        if (onDeleteClick) onDeleteClick(deal)
      } catch (error) {
        console.error('Error deleting deal:', error)
      }
    }
  }

  // Stats cards
  const statsCards = [
    {
      title: 'Total Deals',
      value: stats.total_deals,
      icon: Briefcase,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(stats.total_value),
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Ganados',
      value: stats.won_deals,
      icon: Award,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Perdidos',
      value: stats.lost_deals,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-dark-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-600">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar deals..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-3 h-12 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400"
            />
          </div>

          {/* Stage Filter */}
          <CustomDropdown
            value={stageFilter}
            onChange={(value) => {
              setStageFilter(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'Todas las etapas' },
              ...Object.entries(StageLabels).map(([value, label]) => ({ value, label })),
            ]}
            placeholder="Filtrar por etapa"
          />

          {/* Priority Filter */}
          <CustomDropdown
            value={priorityFilter}
            onChange={(value) => {
              setPriorityFilter(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'Todas las prioridades' },
              ...Object.entries(PriorityLabels).map(([value, label]) => ({ value, label })),
            ]}
            placeholder="Filtrar por prioridad"
          />

          {/* Source Filter */}
          <CustomDropdown
            value={sourceFilter}
            onChange={(value) => {
              setSourceFilter(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'Todas las fuentes' },
              ...Object.entries(SourceLabels).map(([value, label]) => ({ value, label })),
            ]}
            placeholder="Filtrar por fuente"
          />
        </div>

        {/* Active Filters Count */}
        {(search || stageFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
            <Filter className="w-4 h-4" />
            <span>
              {[search, stageFilter !== 'all', priorityFilter !== 'all', sourceFilter !== 'all'].filter(Boolean).length} filtros activos
            </span>
            <button
              onClick={() => {
                setSearch('')
                setStageFilter('all')
                setPriorityFilter('all')
                setSourceFilter('all')
                setPage(1)
              }}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Fecha Cierre
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-dark-400">
                    Cargando deals...
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-dark-400">
                    No se encontraron deals
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{deal.title}</p>
                          {deal.description && (
                            <p className="text-sm text-gray-500 dark:text-dark-400 truncate max-w-xs">
                              {deal.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {deal.contact?.full_name || 'Sin contacto'}
                        </p>
                        {deal.contact?.company && (
                          <p className="text-gray-500 dark:text-dark-400">{deal.contact.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(deal.value, deal.currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Target className="w-3 h-3 text-gray-400 dark:text-dark-400" />
                        <span className="text-xs text-gray-500 dark:text-dark-400">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}
                      >
                        {StageLabels[deal.stage]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(deal.priority)}`}
                      >
                        {PriorityLabels[deal.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-dark-300">
                        <Calendar className="w-4 h-4" />
                        {formatDate(deal.expected_close_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onDealClick && (
                          <button
                            onClick={() => onDealClick(deal)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEditClick && (
                          <button
                            onClick={() => onEditClick(deal)}
                            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteClick && (
                          <button
                            onClick={() => handleDelete(deal)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && deals.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-600 flex items-center justify-between bg-gray-50 dark:bg-dark-700">
            <div className="text-sm text-gray-600 dark:text-dark-300">
              Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} de{' '}
              {totalItems} deals
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-gray-600 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-600 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
