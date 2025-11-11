// frontend/src/pages/DealsPageNew.tsx - Página de Deals con vista Tabla/Kanban

import { useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import DealsTableNew from '@/components/deals/DealsTableNew'
import DealsKanban from '@/components/deals/DealsKanban'
import DealModalNew from '@/components/deals/DealModalNew'
import type { DealOut } from '@/types/deal'

type ViewMode = 'table' | 'kanban'

export default function DealsPageNew() {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">
            Gestiona tus oportunidades de venta
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Deal</span>
          </button>
        </div>
      </div>

      {/* Content - Tabla o Kanban */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <DealsTableNew
            onDealClick={(deal) => handleEdit(deal)}
            onEditClick={handleEdit}
            onCreateClick={handleCreate}
          />
        ) : (
          <DealsKanban
            onEditDeal={handleEdit}
            refreshTrigger={refreshTrigger}
            onCreateDeal={handleCreate}
          />
        )}
      </div>

      {/* Modal */}
      <DealModalNew
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        deal={selectedDeal}
      />
    </div>
  )
}
