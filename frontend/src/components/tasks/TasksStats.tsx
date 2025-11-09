// frontend/src/components/tasks/TasksStats.tsx - Dashboard de estadísticas de Tasks

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  AlertCircle,
  Calendar,
  TrendingUp,
  CircleDashed,
} from 'lucide-react'
import tasksService from '@/services/tasksService'
import type { TaskStats } from '@/types/task'
import { StatusLabels, PriorityLabels } from '@/types/task'

export default function TasksStats() {
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await tasksService.getStats()
      setStats(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Error al cargar estadísticas'}</span>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Tareas',
      value: stats.total_tasks.toLocaleString(),
      icon: CircleDashed,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Pendientes',
      value: stats.pending_tasks.toLocaleString(),
      icon: Clock,
      color: 'gray',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
    {
      title: 'En Progreso',
      value: stats.in_progress_tasks.toLocaleString(),
      icon: Loader2,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Completadas',
      value: stats.completed_tasks.toLocaleString(),
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  const urgentCards = [
    {
      title: 'Vencidas',
      value: stats.overdue_tasks.toLocaleString(),
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Tareas atrasadas',
    },
    {
      title: 'Vencen Hoy',
      value: stats.due_today.toLocaleString(),
      icon: Calendar,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'Requieren atención',
    },
    {
      title: 'Esta Semana',
      value: stats.due_this_week.toLocaleString(),
      icon: TrendingUp,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Próximas 7 días',
    },
    {
      title: 'Tasa Completación',
      value: `${stats.completion_rate.toFixed(1)}%`,
      icon: CheckCircle2,
      color: 'teal',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      description: 'Productividad',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Tarjetas principales de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tarjetas de vencimiento y urgencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {urgentCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${card.bgColor} p-2.5 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{card.title}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          )
        })}
      </div>

      {/* Distribución por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Estado</h3>
          <div className="space-y-3">
            {Object.entries(stats.tasks_by_status).map(([status, count]) => {
              const percentage = stats.total_tasks > 0
                ? (count / stats.total_tasks * 100).toFixed(1)
                : '0'

              const colors: Record<string, string> = {
                PENDING: 'bg-gray-500',
                IN_PROGRESS: 'bg-blue-500',
                COMPLETED: 'bg-green-500',
                CANCELLED: 'bg-red-500',
              }

              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {StatusLabels[status.toLowerCase() as keyof typeof StatusLabels] || status}
                    </span>
                    <span className="text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status] || 'bg-gray-500'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Distribución por prioridad */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Prioridad</h3>
          <div className="space-y-3">
            {Object.entries(stats.tasks_by_priority).map(([priority, count]) => {
              const percentage = stats.total_tasks > 0
                ? (count / stats.total_tasks * 100).toFixed(1)
                : '0'

              const colors: Record<string, string> = {
                LOW: 'bg-gray-400',
                MEDIUM: 'bg-blue-500',
                HIGH: 'bg-orange-500',
                URGENT: 'bg-red-600',
              }

              return (
                <div key={priority}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {PriorityLabels[priority.toLowerCase() as keyof typeof PriorityLabels] || priority}
                    </span>
                    <span className="text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[priority] || 'bg-gray-500'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
