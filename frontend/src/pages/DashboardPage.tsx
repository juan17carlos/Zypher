// frontend/src/pages/DashboardPage.tsx - Dashboard principal con datos reales

import { useState, useEffect } from 'react'
import {
  Users,
  DollarSign,
  CheckSquare,
  TrendingUp,
  Briefcase,
  Clock,
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Loader2,
  ArrowUpRight,
} from 'lucide-react'
import contactsService from '@/services/contactsService'
import dealsService from '@/services/dealsService'
import tasksService from '@/services/tasksService'
import type { ContactStats } from '@/types/contact'
import type { DealStats } from '@/types/deal'
import type { TaskStats } from '@/types/task'
import { StageLabels } from '@/types/deal'

export default function DashboardPage() {
  const [contactStats, setContactStats] = useState<ContactStats | null>(null)
  const [dealStats, setDealStats] = useState<DealStats | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllStats()
  }, [])

  const loadAllStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar todas las estadísticas en paralelo
      const [contacts, deals, tasks] = await Promise.all([
        contactsService.getStats().catch(() => null),
        dealsService.getStats().catch(() => null),
        tasksService.getStats().catch(() => null),
      ])

      setContactStats(contacts)
      setDealStats(deals)
      setTaskStats(tasks)
    } catch (err: any) {
      setError(err.message || 'Error cargando estadísticas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadAllStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu CRM</p>
      </div>

      {/* Tarjetas principales de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Contactos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600 w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Contactos</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{contactStats?.total_contacts || 0}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="font-medium">{contactStats?.active_contacts || 0} activos</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {contactStats?.recent_contacts || 0} nuevos (últimos 7 días)
          </p>
        </div>

        {/* Deals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="text-green-600 w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Pipeline</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${dealStats?.total_value.toLocaleString() || 0}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{dealStats?.active_deals || 0} activos</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ${dealStats?.potential_value.toLocaleString() || 0} potencial
          </p>
        </div>

        {/* Tareas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <CheckSquare className="text-orange-600 w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Tareas</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{taskStats?.pending_tasks || 0}</p>
          <div className="mt-2 flex items-center gap-2">
            {(taskStats?.overdue_tasks || 0) > 0 ? (
              <div className="flex items-center text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{taskStats?.overdue_tasks} vencidas</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-green-600">
                <CheckSquare className="w-4 h-4" />
                <span className="font-medium">Al día</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {taskStats?.due_today || 0} para hoy
          </p>
        </div>

        {/* Conversión */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Target className="text-purple-600 w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Conversión</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {dealStats?.win_rate.toFixed(1) || 0}%
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-sm text-green-600">
              <Award className="w-4 h-4" />
              <span className="font-medium">{dealStats?.won_deals || 0} ganados</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {dealStats?.lost_deals || 0} perdidos
          </p>
        </div>
      </div>

      {/* Pipeline de Ventas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pipeline de Ventas</h2>
            <p className="text-sm text-gray-600 mt-1">Distribución de deals por etapa</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Valor promedio</p>
            <p className="text-lg font-bold text-gray-900">
              ${dealStats?.average_deal_value.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {dealStats?.deals_by_stage &&
            Object.entries(dealStats.deals_by_stage).map(([stage, count]) => {
              const stageKey = stage.toLowerCase() as keyof typeof StageLabels
              const label = StageLabels[stageKey] || stage
              const value = (dealStats.value_by_stage as any)[stage] || 0

              // Colores por etapa
              const colors: Record<string, { bg: string; text: string; border: string }> = {
                LEAD: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
                CONTACTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                QUALIFIED: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
                PROPOSAL: {
                  bg: 'bg-purple-50',
                  text: 'text-purple-700',
                  border: 'border-purple-200',
                },
                NEGOTIATION: {
                  bg: 'bg-orange-50',
                  text: 'text-orange-700',
                  border: 'border-orange-200',
                },
                WON: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                LOST: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
              }

              const colorScheme = colors[stage] || colors.LEAD

              return (
                <div
                  key={stage}
                  className={`${colorScheme.bg} border ${colorScheme.border} rounded-lg p-4 text-center`}
                >
                  <p className="text-xs font-medium text-gray-600 mb-2">{label}</p>
                  <p className={`text-2xl font-bold ${colorScheme.text} mb-1`}>{count}</p>
                  <p className="text-xs text-gray-600">${value.toLocaleString()}</p>
                </div>
              )
            })}
        </div>
      </div>

      {/* Grid de métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad de Tareas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Productividad</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tareas Completadas</p>
                  <p className="text-xs text-gray-500">Total acumulado</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{taskStats?.completed_tasks || 0}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">En Progreso</p>
                  <p className="text-xs text-gray-500">Actualmente trabajando</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {taskStats?.in_progress_tasks || 0}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Esta Semana</p>
                  <p className="text-xs text-gray-500">Próximos 7 días</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{taskStats?.due_this_week || 0}</p>
            </div>

            {/* Barra de progreso */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tasa de Completación</span>
                <span className="text-sm font-bold text-indigo-600">
                  {taskStats?.completion_rate.toFixed(1) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${taskStats?.completion_rate || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Contactos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contactos por Industria</h3>
          <div className="space-y-3">
            {contactStats?.by_industry &&
              Object.entries(contactStats.by_industry)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([industry, count]) => {
                  const percentage =
                    ((count / (contactStats.total_contacts || 1)) * 100).toFixed(1)

                  return (
                    <div key={industry}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {industry.toLowerCase().replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
          </div>

          {contactStats?.by_industry && Object.keys(contactStats.by_industry).length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No hay contactos todavía</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen final */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-sm p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-bold">{dealStats?.total_deals || 0}</p>
            <p className="text-sm opacity-90">Deals Totales</p>
          </div>
          <div className="text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-bold">${dealStats?.won_value.toLocaleString() || 0}</p>
            <p className="text-sm opacity-90">Valor Ganado</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-bold">
              {dealStats?.average_win_probability.toFixed(0) || 0}%
            </p>
            <p className="text-sm opacity-90">Probabilidad Promedio</p>
          </div>
        </div>
      </div>
    </div>
  )
}
