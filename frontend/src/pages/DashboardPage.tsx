import { Users, DollarSign, CheckSquare, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Total Contactos</h3>
            <Users className="text-primary-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">127</p>
          <p className="text-sm text-green-600 mt-2">↗ +12% este mes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Deals Activos</h3>
            <DollarSign className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">23</p>
          <p className="text-sm text-green-600 mt-2">↗ +5 esta semana</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Tareas Pendientes</h3>
            <CheckSquare className="text-orange-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">8</p>
          <p className="text-sm text-orange-600 mt-2">3 para hoy</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Conversión</h3>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-800">34%</p>
          <p className="text-sm text-green-600 mt-2">↗ +2.4% vs mes pasado</p>
        </div>
      </div>

      {/* Pipeline Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pipeline de Ventas</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Lead</p>
            <p className="text-2xl font-bold text-gray-800">23</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Contactado</p>
            <p className="text-2xl font-bold text-gray-800">15</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Propuesta</p>
            <p className="text-2xl font-bold text-gray-800">8</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Negociación</p>
            <p className="text-2xl font-bold text-gray-800">5</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Cerrado</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
        </div>
      </div>
    </div>
  )
}
