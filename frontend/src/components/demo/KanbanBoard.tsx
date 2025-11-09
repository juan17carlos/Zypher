// frontend/src/components/demo/KanbanBoard.tsx
// Tablero Kanban EXACTO como Bitrix24 con drag & drop

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
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
  ChevronDown,
  Search,
  Filter,
  Bell,
  Settings,
  Menu,
} from 'lucide-react'

// Tipos
interface Deal {
  id: string
  title: string
  value: number
  client: string
  company: string
  timeAgo: string
  avatar?: string
}

interface Column {
  id: string
  title: string
  value: number
  count: number
  color: string
  deals: Deal[]
}

// Datos de ejemplo
const initialColumns: Column[] = [
  {
    id: 'en_desarrollo',
    title: 'En desarrollo',
    value: 30000,
    count: 1,
    color: 'bg-blue-500',
    deals: [
      {
        id: 'deal-1',
        title: 'Venta de cada',
        value: 30000,
        client: 'Juan Bastidas',
        company: 'CPO',
        timeAgo: 'hace 53 minutos',
      },
    ],
  },
  {
    id: 'crear_documentos',
    title: 'Crear documentos',
    value: 0,
    count: 0,
    color: 'bg-purple-500',
    deals: [],
  },
  {
    id: 'nombre',
    title: 'Nombre',
    value: 0,
    count: 0,
    color: 'bg-cyan-500',
    deals: [],
  },
  {
    id: 'factura',
    title: 'Factura',
    value: 0,
    count: 0,
    color: 'bg-teal-500',
    deals: [],
  },
  {
    id: 'en_progreso',
    title: 'En progreso',
    value: 0,
    count: 0,
    color: 'bg-indigo-500',
    deals: [],
  },
]

// Componente de Deal Card
function DealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
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
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:border-blue-300 transition-all"
    >
      {/* Header con título */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{deal.title}</h4>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Valor */}
      <div className="text-2xl font-bold text-gray-900 mb-3">
        ${deal.value.toLocaleString()}
      </div>

      {/* Cliente info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{deal.client}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="w-4 h-4" />
          <span>{deal.company}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{deal.timeAgo}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Llamar"
        >
          <Phone className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Enviar email"
        >
          <Mail className="w-4 h-4" />
        </motion.button>
        <div className="flex-1"></div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Componente de Columna
function KanbanColumn({ column, children }: { column: Column; children: React.ReactNode }) {
  const { setNodeRef } = useSortable({ id: column.id })

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      {/* Header de columna */}
      <div className={`${column.color} bg-opacity-10 rounded-t-lg p-4 border-t-4 ${column.color}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="text-sm text-gray-600">({column.count})</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ${column.value.toLocaleString()}
        </div>
      </div>

      {/* Deals list */}
      <div className="bg-gray-50 rounded-b-lg p-3 space-y-3 min-h-[400px]">
        {children}

        {/* Add button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Negociación rápida</span>
        </motion.button>
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeColumnId = findColumnByDealId(active.id as string)
    const overColumnId = over.id as string

    if (!activeColumnId) return

    setColumns((cols) => {
      const newColumns = [...cols]

      // Find source and destination columns
      const sourceColumn = newColumns.find((col) => col.id === activeColumnId)
      const destColumn = newColumns.find(
        (col) => col.id === overColumnId || col.deals.some((d) => d.id === overColumnId)
      )

      if (!sourceColumn || !destColumn) return cols

      // Find the deal
      const dealIndex = sourceColumn.deals.findIndex((d) => d.id === active.id)
      if (dealIndex === -1) return cols

      const [deal] = sourceColumn.deals.splice(dealIndex, 1)

      // Add to destination
      if (destColumn.id === overColumnId) {
        destColumn.deals.push(deal)
      } else {
        const overIndex = destColumn.deals.findIndex((d) => d.id === overColumnId)
        destColumn.deals.splice(overIndex, 1, deal)
      }

      // Update counts and values
      sourceColumn.count = sourceColumn.deals.length
      sourceColumn.value = sourceColumn.deals.reduce((sum, d) => sum + d.value, 0)
      destColumn.count = destColumn.deals.length
      destColumn.value = destColumn.deals.reduce((sum, d) => sum + d.value, 0)

      return newColumns
    })

    setActiveId(null)
  }

  const findColumnByDealId = (dealId: string) => {
    for (const column of columns) {
      if (column.deals.some((deal) => deal.id === dealId)) {
        return column.id
      }
    }
    return null
  }

  const activeDeal = activeId
    ? columns.flatMap((col) => col.deals).find((deal) => deal.id === activeId)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Top Bar - Como Bitrix24 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </motion.button>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Negociaciones</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Kanban
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear
              </motion.button>

              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                General
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="buscar"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-4 border-b border-gray-200">
            {['Kanban', 'Lista', 'Actividades', 'Calendario'].map((tab, index) => (
              <button
                key={tab}
                className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                  index === 0
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {columns.map((column) => (
              <SortableContext
                key={column.id}
                items={column.deals.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn column={column}>
                  {column.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </KanbanColumn>
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeDeal ? (
              <div className="rotate-6 opacity-90">
                <DealCard deal={activeDeal} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Info Footer - Como Bitrix24 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-purple-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg"
      >
        <p className="text-sm font-medium">
          💡 Arrastra las tarjetas entre columnas para cambiar de etapa
        </p>
      </motion.div>
    </div>
  )
}
