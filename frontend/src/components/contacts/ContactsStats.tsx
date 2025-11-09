// frontend/src/components/contacts/ContactsStats.tsx - Dashboard de estadísticas

import { useEffect, useState } from 'react'
import { Users, UserCheck, UserX, TrendingUp, Globe, Building2 } from 'lucide-react'
import contactService from '@/services/contactsService'
import type { ContactStats } from '@/types/contact'
import { IndustryLabels } from '@/types/contact'

export default function ContactsStats() {
  const [stats, setStats] = useState<ContactStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await contactService.getStats()
      setStats(data)
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'Total Contactos',
      value: stats.total_contacts,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Activos',
      value: stats.active_contacts,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Inactivos',
      value: stats.inactive_contacts,
      icon: UserX,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Nuevos (7 días)',
      value: stats.recent_contacts,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="mb-8">
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
            </div>
          )
        })}
      </div>

      {/* Distribuciones */}
      <div className="grid grid-cols-2 gap-6">
        {/* Por Industria */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Por Industria</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.by_industry)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([industry, count]) => {
                const percentage = ((count / stats.total_contacts) * 100).toFixed(1)
                return (
                  <div key={industry}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {IndustryLabels[industry as keyof typeof IndustryLabels] || industry}
                      </span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Por País */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Por País</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.by_country)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([country, count]) => {
                const percentage = ((count / stats.total_contacts) * 100).toFixed(1)
                return (
                  <div key={country}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{country}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
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
