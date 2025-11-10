// frontend/src/pages/DashboardPage.tsx - CRM Principal con Kanban Unificado

import { useState } from 'react'
import { Plus } from 'lucide-react'
import DealsKanban from '@/components/deals/DealsKanban'
import DealDetailDrawer from '@/components/deals/DealDetailDrawer'
import DealModal from '@/components/deals/DealModal'
import AnimatedButton from '@/components/ui/AnimatedButton'
import type { DealOut } from '@/types/deal'

export default function DashboardPage() {
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<DealOut | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateDeal = () => {
    setSelectedDeal(null)
    setModalOpen(true)
  }

  const handleEditDeal = (deal: DealOut) => {
    setSelectedDealId(deal.id)
    setDrawerOpen(true)
  }

  const handleEditFromDrawer = async () => {
    // Cargar el deal actual y abrir el modal de edición
    if (selectedDealId) {
      try {
        const dealData = await import('@/services/dealsService')
        const deal = await dealData.default.getById(String(selectedDealId))
        setSelectedDeal(deal)
        setDrawerOpen(false) // Cerrar el drawer
        setModalOpen(true) // Abrir el modal de edición
      } catch (error) {
        console.error('Error al cargar el deal:', error)
      }
    }
  }

  const handleUpdate = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedDealId(null)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedDeal(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestión completa de clientes y negociaciones
          </p>
        </div>
        <AnimatedButton
          onClick={handleCreateDeal}
          variant="primary"
          size="md"
          icon={<Plus className="w-5 h-5" />}
        >
          Crear Deal
        </AnimatedButton>
      </div>

      {/* Kanban Board - PANTALLA COMPLETA */}
      <div className="flex-1 overflow-hidden">
        <DealsKanban
          onEditDeal={handleEditDeal}
          refreshTrigger={refreshTrigger}
          onCreateDeal={handleCreateDeal}
        />
      </div>

      {/* Modal para crear/editar deal */}
      <DealModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleUpdate}
        deal={selectedDeal}
      />

      {/* Drawer unificado para ver detalle completo */}
      <DealDetailDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        dealId={selectedDealId}
        onUpdate={handleUpdate}
        onEdit={handleEditFromDrawer}
      />
    </div>
  )
}
