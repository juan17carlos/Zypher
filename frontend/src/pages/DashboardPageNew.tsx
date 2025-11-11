// frontend/src/pages/DashboardPageNew.tsx - Dashboard principal del CRM con widgets

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  CheckSquare,
  DollarSign,
  Plus,
  ArrowRight,
  Calendar,
  Award,
  Clock,
  AlertCircle,
  Briefcase,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import contactsService from '@/services/contactsService'
import dealsService from '@/services/dealsService'
import tasksService from '@/services/tasksService'
import type { DealStats } from '@/types/deal'
import type { TaskStats } from '@/types/task'

interface DashboardStats {
  totalContacts: number
  activeContacts: number
  totalDeals: number
  totalDealValue: number
  wonDeals: number
  totalTasks: number
  pendingTasks: number
  overdueTasks: number
}

export default function DashboardPageNew() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    activeContacts: 0,
    totalDeals: 0,
    totalDealValue: 0,
    wonDeals: 0,
    totalTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  })
  const [dealStats, setDealStats] = useState<DealStats | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar stats de cada módulo en paralelo
      const [contactStatsData, dealStatsData, taskStatsData] = await Promise.all([
        contactsService.getStats(),
        dealsService.getStats(),
        tasksService.getStats(),
      ])

      setStats({
        totalContacts: contactStatsData.total_contacts,
        activeContacts: contactStatsData.active_contacts,
        totalDeals: dealStatsData.total_deals,
        totalDealValue: dealStatsData.total_value,
        wonDeals: dealStatsData.won_deals,
        totalTasks: taskStatsData.total_tasks,
        pendingTasks: taskStatsData.pending_tasks,
        overdueTasks: taskStatsData.overdue_tasks,
      })

      setDealStats(dealStatsData)
      setTaskStats(taskStatsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Quick actions
  const quickActions = [
    {
      title: 'Nuevo Contacto',
      icon: Users,
      color: 'purple',
      action: () => navigate('/contacts'),
    },
    {
      title: 'Nuevo Deal',
      icon: TrendingUp,
      color: 'blue',
      action: () => navigate('/deals'),
    },
    {
      title: 'Nueva Tarea',
      icon: CheckSquare,
      color: 'green',
      action: () => navigate('/tasks'),
    },
  ]

  // Stats cards principales
  const mainStats = [
    {
      title: 'Total Contactos',
      value: stats.totalContacts,
      subtitle: `${stats.activeContacts} activos`,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      link: '/contacts',
    },
    {
      title: 'Total Deals',
      value: stats.totalDeals,
      subtitle: `${stats.wonDeals} ganados`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/deals',
    },
    {
      title: 'Valor Pipeline',
      value: formatCurrency(stats.totalDealValue),
      subtitle: 'Total en negociación',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      link: '/deals',
    },
    {
      title: 'Tareas Pendientes',
      value: stats.pendingTasks,
      subtitle: `${stats.overdueTasks} vencidas`,
      icon: CheckSquare,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      link: '/tasks',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 dark:text-dark-300">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-dark-300 mt-2">
          Bienvenido a tu CRM - Vista general de tus operaciones
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(stat.link)}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-dark-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-dark-300 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-400">{stat.subtitle}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                    <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{action.title}</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-400 dark:text-dark-400" />
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Deals by Stage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Deals por Etapa
          </h2>
          {dealStats && (
            <div className="space-y-3">
              {Object.entries(dealStats.deals_by_stage).map(([stage, count], index) => {
                const stageLabels: Record<string, string> = {
                  LEAD: 'Lead',
                  CONTACTED: 'Contactado',
                  QUALIFIED: 'Calificado',
                  PROPOSAL: 'Propuesta',
                  NEGOTIATION: 'Negociación',
                  WON: 'Ganado',
                  LOST: 'Perdido',
                }
                const colors = ['purple', 'blue', 'cyan', 'indigo', 'orange', 'green', 'red']
                const color = colors[index % colors.length]
                const percentage = dealStats.total_deals > 0
                  ? ((count / dealStats.total_deals) * 100).toFixed(1)
                  : 0

                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200">
                        {stageLabels[stage] || stage}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-2 rounded-full`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tasks Overview & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Tareas por Estado
          </h2>
          {taskStats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-dark-300">
                    Pendientes
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {taskStats.pending_tasks}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    En Progreso
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {taskStats.in_progress_tasks}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Completadas
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {taskStats.completed_tasks}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Vencidas
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {taskStats.overdue_tasks}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-600">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Métricas Clave
          </h2>
          {dealStats && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-900/50">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-dark-300">
                    Tasa de Conversión
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {dealStats.win_rate.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-900/50">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-dark-300">
                    Valor Promedio Deal
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(dealStats.average_deal_value)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-900/50">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-dark-300">
                    Probabilidad Promedio
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {dealStats.average_win_probability.toFixed(0)}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Dashboard actualizado
              </p>
              <p className="text-sm text-gray-600 dark:text-dark-300">
                {new Date().toLocaleDateString('es-EC', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  )
}
