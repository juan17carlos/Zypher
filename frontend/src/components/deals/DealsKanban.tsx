// frontend/src/components/deals/DealsKanban.tsx
// Kanban board for deals with drag & drop functionality

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import {
  Plus,
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  MoreVertical,
  Building,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import dealsService from '@/services/dealsService'
import type { DealOut } from '@/types/deal'
import { STAGE_OPTIONS } from '@/types/deal'

interface DealsKanbanProps {
  onEditDeal: (deal: DealOut) => void
  onCreateDeal: () => void
  refreshTrigger?: number
}

interface Column {
  id: string
  title: string
  value: number
  count: number
  color: string
  deals: DealOut[]
}

// Deal Card Component
function DealCard({ deal, onEdit }: { deal: DealOut; onEdit: (deal: DealOut) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
      onClick={() => onEdit(deal)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:border-indigo-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{deal.title}</h4>
        <button
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(deal)
          }}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-indigo-600 mb-3">
        {dealsService.formatCurrency(deal.value, deal.currency)}
      </div>

      {/* Contact info */}
      {deal.contact && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{deal.contact.full_name}</span>
          </div>
          {deal.contact.company && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{deal.contact.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(deal.updated_at).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      )}

      {/* Probability */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${deal.probability}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">{deal.probability}%</span>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Llamar"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Enviar email"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="w-4 h-4" />
        </motion.button>
        <div className="flex-1"></div>
        {deal.owner && (
          <div
            className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
            title={deal.owner.full_name}
          >
            {deal.owner.full_name.charAt(0)}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Kanban Column Component
function KanbanColumn({
  column,
  children,
  onAddDeal,
}: {
  column: Column
  children: React.ReactNode
  onAddDeal: () => void
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className="bg-white rounded-t-xl border-t border-l border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <span className="text-sm text-gray-500">({column.count})</span>
          </div>
          <button
            onClick={onAddDeal}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-gray-900">
            ${column.value.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Column Body */}
      <div className="bg-gray-50 border-l border-r border-b border-gray-200 rounded-b-xl min-h-[400px] p-4 space-y-3">
        {children}
      </div>
    </div>
  )
}

export default function DealsKanban({ onEditDeal, onCreateDeal, refreshTrigger }: DealsKanbanProps) {
  const [columns, setColumns] = useState<Column[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Load deals
  useEffect(() => {
    loadDeals()
  }, [refreshTrigger])

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await dealsService.getAllWithPagination({
        page_size: 100,
        is_active: true,
      })

      // Group deals by stage
      const dealsByStage: { [key: string]: DealOut[] } = {}
      STAGE_OPTIONS.forEach((stage) => {
        dealsByStage[stage.value] = []
      })

      response.items.forEach((deal) => {
        if (dealsByStage[deal.stage]) {
          dealsByStage[deal.stage].push(deal)
        }
      })

      // Create columns
      const newColumns: Column[] = STAGE_OPTIONS.map((stage) => {
        const deals = dealsByStage[stage.value] || []
        const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)

        return {
          id: stage.value,
          title: stage.label,
          value: totalValue,
          count: deals.length,
          color: getStageColor(stage.value),
          deals,
        }
      })

      setColumns(newColumns)
    } catch (err: any) {
      console.error('Error loading deals:', err)
      setError(err.message || 'Error al cargar los deals')
    } finally {
      setLoading(false)
    }
  }

  const getStageColor = (stage: string): string => {
    const colors: { [key: string]: string } = {
      LEAD: 'bg-gray-500',
      QUALIFIED: 'bg-blue-500',
      PROPOSAL: 'bg-purple-500',
      NEGOTIATION: 'bg-yellow-500',
      WON: 'bg-green-500',
      LOST: 'bg-red-500',
    }
    return colors[stage] || 'bg-gray-500'
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const dealId = parseInt(active.id as string)
    const newStage = over.id as string

    // Find the deal
    let deal: DealOut | undefined
    for (const column of columns) {
      deal = column.deals.find((d) => d.id === dealId)
      if (deal) break
    }

    if (!deal || deal.stage === newStage) {
      setActiveId(null)
      return
    }

    // Update deal stage
    try {
      await dealsService.update(dealId, { stage: newStage as any })
      await loadDeals() // Reload deals
    } catch (err) {
      console.error('Error updating deal stage:', err)
    }

    setActiveId(null)
  }

  const activeDeal = activeId
    ? columns.flatMap((c) => c.deals).find((d) => d.id.toString() === activeId)
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-red-800">Error</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} onAddDeal={onCreateDeal}>
              <SortableContext
                items={column.deals.map((d) => d.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onEdit={onEditDeal} />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} onEdit={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
