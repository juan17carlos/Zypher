// frontend/src/pages/DealsPage.tsx - Página de Deals/Pipeline (Phase 3)

import { useState } from 'react'
import { Plus } from 'lucide-react'
import DealsStats from '@/components/deals/DealsStats'
import DealModal from '@/components/deals/DealModal'
import type { DealOut } from '@/types/deal'

export default function DealsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<DealOut | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreate = () => {
    setSelectedDeal(null)
    setModalOpen(true)
  }

  // const _handleEdit = (deal: DealOut) => {
  //   setSelectedDeal(deal)
  //   setModalOpen(true)
  // }

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedDeal(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Ventas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus oportunidades de negocio</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nuevo Deal
        </button>
      </div>

      {/* Estadísticas */}
      <DealsStats key={refreshTrigger} />

      {/* Tabla/Pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Vista de tabla y pipeline Kanban - En desarrollo
          </p>
          <p className="text-sm text-gray-400">
            Usa el botón "Nuevo Deal" para crear oportunidades de venta
          </p>
        </div>
      </div>

      {/* Modal */}
      <DealModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        deal={selectedDeal}
      />
    </div>
  )
}
