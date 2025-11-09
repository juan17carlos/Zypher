// frontend/src/components/deals/DealsStats.tsx - Dashboard de estadísticas de Deals (Phase 3)

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Target,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import dealsService from '@/services/dealsService'
import type { DealStats } from '@/types/deal'
import { StageLabels, PriorityLabels } from '@/types/deal'

export default function DealsStats() {
  const [stats, setStats] = useState<DealStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await dealsService.getStats()
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
      title: 'Total Deals',
      value: stats.total_deals.toLocaleString(),
      icon: Target,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Deals Activos',
      value: stats.active_deals.toLocaleString(),
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Deals Ganados',
      value: stats.won_deals.toLocaleString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Deals Perdidos',
      value: stats.lost_deals.toLocaleString(),
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ]

  const valueCards = [
    {
      title: 'Valor Total',
      value: dealsService.formatCurrency(stats.total_value),
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Valor Ganado',
      value: dealsService.formatCurrency(stats.won_value),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Valor Potencial',
      value: dealsService.formatCurrency(stats.potential_value),
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Promedio por Deal',
      value: dealsService.formatCurrency(stats.average_deal_value),
      icon: DollarSign,
      color: 'cyan',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cards de totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="crm-card bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards de valores monetarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueCards.map((card, index) => (
          <div
            key={index}
            className="crm-card bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Etapa */}
        <div className="crm-card bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución por Etapa</h3>
          <div className="space-y-4">
            {Object.entries(stats.deals_by_stage).map(([stage, count]) => {
              const percentage = stats.total_deals > 0 ? (count / stats.total_deals) * 100 : 0
              const value = stats.value_by_stage[stage as keyof typeof stats.value_by_stage] || 0

              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {StageLabels[stage as keyof typeof StageLabels]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500">
                        ({dealsService.formatCurrency(value)})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Distribución por Prioridad */}
        <div className="crm-card bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución por Prioridad</h3>
          <div className="space-y-4">
            {Object.entries(stats.deals_by_priority).map(([priority, count]) => {
              const percentage = stats.total_deals > 0 ? (count / stats.total_deals) * 100 : 0

              const colors: Record<string, string> = {
                low: 'bg-gray-500',
                medium: 'bg-blue-500',
                high: 'bg-orange-500',
                urgent: 'bg-red-500',
              }

              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {PriorityLabels[priority as keyof typeof PriorityLabels]}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[priority]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Métricas de Conversión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="crm-card bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Win Rate</h3>
              <p className="text-sm text-gray-600">Tasa de éxito de deals cerrados</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-green-600">{stats.win_rate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mb-2">
              ({stats.won_deals} ganados / {stats.won_deals + stats.lost_deals} cerrados)
            </p>
          </div>
        </div>

        <div className="crm-card bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tasa de Conversión</h3>
              <p className="text-sm text-gray-600">De leads a deals ganados</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-blue-600">{stats.conversion_rate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mb-2">
              Probabilidad promedio: {stats.average_win_probability.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
