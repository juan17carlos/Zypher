// frontend/src/components/tasks/TasksTableNew.tsx - Tabla de Tasks con diseño Facturación Pro

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
  ListTodo,
  Clock,
  Loader2 as LoaderIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CheckSquare,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import type { TaskOut, TaskStatus, TaskPriority } from '@/types/task'
import { StatusLabels, PriorityLabels, StatusColors, PriorityColors } from '@/types/task'
import CustomDropdown from '@/components/ui/CustomDropdown'

interface TasksTableNewProps {
  onTaskClick?: (task: TaskOut) => void
  onEditClick?: (task: TaskOut) => void
  onDeleteClick?: (task: TaskOut) => void
  onCreateClick?: () => void
}

interface StatsData {
  total_tasks: number
  pending_tasks: number
  in_progress_tasks: number
  completed_tasks: number
  overdue_tasks: number
}

export default function TasksTableNew({
  onTaskClick,
  onEditClick,
  onDeleteClick,
  onCreateClick,
}: TasksTableNewProps) {
  const [tasks, setTasks] = useState<TaskOut[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData>({
    total_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
  })

  // Filtros
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 10

  // Cargar tasks
  useEffect(() => {
    loadTasks()
  }, [page, search, statusFilter, priorityFilter])

  // Cargar stats
  useEffect(() => {
    loadStats()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await tasksService.getAllWithPagination({
        page,
        page_size: pageSize,
        search: search || undefined,
        status: statusFilter !== 'all' ? (statusFilter as TaskStatus) : undefined,
        priority: priorityFilter !== 'all' ? (priorityFilter as TaskPriority) : undefined,
      })
      setTasks(response.items)
      setTotalPages(response.total_pages)
      setTotalItems(response.total)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await tasksService.getStats()
      setStats({
        total_tasks: statsData.total_tasks,
        pending_tasks: statsData.pending_tasks,
        in_progress_tasks: statsData.in_progress_tasks,
        completed_tasks: statsData.completed_tasks,
        overdue_tasks: statsData.overdue_tasks,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[StatusColors[status] as keyof typeof colors] || colors.gray
  }

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[PriorityColors[priority] as keyof typeof colors] || colors.gray
  }

  const isOverdue = (task: TaskOut): boolean => {
    return tasksService.isOverdue(task)
  }

  const handleDelete = async (task: TaskOut) => {
    if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      try {
        await tasksService.delete(task.id)
        loadTasks()
        loadStats()
        if (onDeleteClick) onDeleteClick(task)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleToggleComplete = async (task: TaskOut) => {
    try {
      const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed'
      await tasksService.update(task.id, { status: newStatus })
      loadTasks()
      loadStats()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Stats cards
  const statsCards = [
    {
      title: 'Total Tareas',
      value: stats.total_tasks,
      icon: ListTodo,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Pendientes',
      value: stats.pending_tasks,
      icon: Clock,
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      title: 'En Progreso',
      value: stats.in_progress_tasks,
      icon: LoaderIcon,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Completadas',
      value: stats.completed_tasks,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Vencidas',
      value: stats.overdue_tasks,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-3 h-12 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400"
            />
          </div>

          {/* Status Filter */}
          <CustomDropdown
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'Todos los estados' },
              ...Object.entries(StatusLabels).map(([value, label]) => ({ value, label })),
            ]}
            placeholder="Filtrar por estado"
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
        </div>

        {/* Active Filters Count */}
        {(search || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-dark-300">
            <Filter className="w-4 h-4" />
            <span>
              {[search, statusFilter !== 'all', priorityFilter !== 'all'].filter(Boolean).length} filtros activos
            </span>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setPriorityFilter('all')
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
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Tarea
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Fecha Vencimiento
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-dark-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-dark-400">
                    Cargando tareas...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-dark-400">
                    No se encontraron tareas
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors ${
                      isOverdue(task) ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`p-1 rounded transition-colors ${
                            task.status === 'completed'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-400 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400'
                          }`}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-current rounded-full" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`font-medium text-gray-900 dark:text-white ${
                                task.status === 'completed' ? 'line-through text-gray-500 dark:text-dark-400' : ''
                              }`}
                            >
                              {task.title}
                            </p>
                            {isOverdue(task) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                Vencida
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-dark-400 truncate max-w-md mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        {StatusLabels[task.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {PriorityLabels[task.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-dark-300">
                        <Calendar className="w-4 h-4" />
                        {formatDate(task.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onTaskClick && (
                          <button
                            onClick={() => onTaskClick(task)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEditClick && (
                          <button
                            onClick={() => onEditClick(task)}
                            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteClick && (
                          <button
                            onClick={() => handleDelete(task)}
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
        {!loading && tasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-600 flex items-center justify-between bg-gray-50 dark:bg-dark-700">
            <div className="text-sm text-gray-600 dark:text-dark-300">
              Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} de{' '}
              {totalItems} tareas
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
