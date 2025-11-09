// frontend/src/components/tasks/TasksTable.tsx - Tabla profesional de tareas con filtros

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Briefcase,
  X,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import type { TaskOut, TaskStatus, TaskPriority } from '@/types/task'
import {
  StatusLabels,
  PriorityLabels,
  StatusColors,
  PriorityColors,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/types/task'

interface TasksTableProps {
  onTaskClick?: (task: TaskOut) => void
  onEditClick?: (task: TaskOut) => void
  onDeleteClick?: (task: TaskOut) => void
  onCreateClick?: () => void
  contactId?: number // Filtrar por contacto específico
  dealId?: number // Filtrar por deal específico
}

export default function TasksTable({
  onTaskClick,
  onEditClick,
  onDeleteClick,
  onCreateClick,
  contactId,
  dealId,
}: TasksTableProps) {
  const [tasks, setTasks] = useState<TaskOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  // Filtros
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [overdueFilter, setOverdueFilter] = useState<boolean | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)

  // Ordenamiento
  const [sortBy, setSortBy] = useState('due_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Menu contextual
  const [activeMenu, setActiveMenu] = useState<number | null>(null)

  // Cargar tasks
  useEffect(() => {
    loadTasks()
  }, [currentPage, pageSize, search, statusFilter, priorityFilter, overdueFilter, sortBy, sortOrder, contactId, dealId])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = {
        page: currentPage,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      }

      if (search) params.search = search
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter.toUpperCase()
      if (priorityFilter && priorityFilter !== 'all') params.priority = priorityFilter.toUpperCase()
      if (overdueFilter !== undefined) params.overdue = overdueFilter
      if (contactId) params.contact_id = contactId
      if (dealId) params.deal_id = dealId

      const response = await tasksService.getAllWithPagination(params)

      setTasks(response.items)
      setTotalTasks(response.total)
      setTotalPages(response.total_pages)
    } catch (err: any) {
      setError(err.message || 'Error cargando tareas')
      console.error('Error:', err)
    } finally {
      setLoading(false)
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

  const handleComplete = async (task: TaskOut) => {
    try {
      await tasksService.markAsCompleted(task.id)
      loadTasks()
    } catch (err: any) {
      alert(err.message || 'Error al completar tarea')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase() as TaskStatus
    const color = StatusColors[statusLower] || 'gray'
    const label = StatusLabels[statusLower] || status

    const colorClasses: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800 border-gray-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
        {label}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityLower = priority.toLowerCase() as TaskPriority
    const color = PriorityColors[priorityLower] || 'gray'
    const label = PriorityLabels[priorityLower] || priority

    const colorClasses: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-700',
      blue: 'bg-blue-100 text-blue-700',
      orange: 'bg-orange-100 text-orange-700',
      red: 'bg-red-100 text-red-700',
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color]}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalTasks} tarea{totalTasks !== 1 ? 's' : ''} en total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showFilters
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>

            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas por título o descripción..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas</option>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimiento
                </label>
                <select
                  value={overdueFilter === undefined ? 'all' : overdueFilter ? 'overdue' : 'not_overdue'}
                  onChange={(e) => {
                    const value = e.target.value
                    setOverdueFilter(value === 'all' ? undefined : value === 'overdue')
                    setCurrentPage(1)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas</option>
                  <option value="overdue">Vencidas</option>
                  <option value="not_overdue">Al día</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                    setOverdueFilter(undefined)
                    setCurrentPage(1)
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadTasks}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
            >
              Reintentar
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-sm text-gray-500 mb-6">
              {search || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Comienza creando tu primera tarea'}
            </p>
            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea
            </button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('title')}
                      className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center gap-1"
                    >
                      Tarea
                      {sortBy === 'title' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('due_date')}
                      className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 flex items-center gap-1"
                    >
                      Vencimiento
                      {sortBy === 'due_date' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Relacionada con
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => {
                  const isOverdue = tasksService.isOverdue(task)
                  const isDueToday = tasksService.isDueToday(task)

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onTaskClick?.(task)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.due_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span
                              className={`text-sm ${
                                isOverdue
                                  ? 'text-red-600 font-medium'
                                  : isDueToday
                                  ? 'text-orange-600 font-medium'
                                  : 'text-gray-900'
                              }`}
                            >
                              {tasksService.formatDate(task.due_date)}
                            </span>
                            {isOverdue && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sin fecha</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {task.contact_id && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="w-3 h-3" />
                              <span>Contacto #{task.contact_id}</span>
                            </div>
                          )}
                          {task.deal_id && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Briefcase className="w-3 h-3" />
                              <span>Deal #{task.deal_id}</span>
                            </div>
                          )}
                          {!task.contact_id && !task.deal_id && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {task.status !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleComplete(task)
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Completar"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditClick?.(task)
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteClick?.(task)
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalTasks)}
                  </span>{' '}
                  de <span className="font-medium">{totalTasks}</span> tareas
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
