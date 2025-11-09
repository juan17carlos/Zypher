// frontend/src/pages/DealsPage.tsx - Página de Deals/Pipeline (Phase 3)

import { useState } from 'react'
import { Plus } from 'lucide-react'
import DealsStats from '@/components/deals/DealsStats'
import DealsKanban from '@/components/deals/DealsKanban'
import DealModal from '@/components/deals/DealModal'
import AnimatedButton from '@/components/ui/AnimatedButton'
import type { DealOut } from '@/types/deal'

export default function DealsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<DealOut | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreate = () => {
    setSelectedDeal(null)
    setModalOpen(true)
  }

  const handleEdit = (deal: DealOut) => {
    setSelectedDeal(deal)
    setModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedDeal(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Negociaciones</h1>
          <p className="text-sm text-gray-600 mt-1">Pipeline de ventas</p>
        </div>
        <AnimatedButton
          onClick={handleCreate}
          variant="primary"
          size="md"
          icon={<Plus className="w-5 h-5" />}
        >
          Crear
        </AnimatedButton>
      </div>

      {/* Kanban Board - PANTALLA COMPLETA */}
      <div className="flex-1 overflow-hidden">
        <DealsKanban onEditDeal={handleEdit} refreshTrigger={refreshTrigger} onCreateDeal={handleCreate} />
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
