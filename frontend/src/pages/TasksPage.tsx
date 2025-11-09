// frontend/src/pages/TasksPage.tsx - Página principal de Tareas

import { useState } from 'react'
import TasksStats from '@/components/tasks/TasksStats'
import TasksTable from '@/components/tasks/TasksTable'
import TaskModal from '@/components/tasks/TaskModal'
import type { TaskOut } from '@/types/task'
import tasksService from '@/services/tasksService'

export default function TasksPage() {
  const [_selectedTask, setSelectedTask] = useState<TaskOut | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskOut | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateClick = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (task: TaskOut) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteClick = async (task: TaskOut) => {
    if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      try {
        await tasksService.delete(task.id)
        setRefreshKey((prev) => prev + 1) // Trigger reload
        alert('Tarea eliminada exitosamente')
      } catch (err: any) {
        alert(err.message || 'Error eliminando tarea')
      }
    }
  }

  const handleTaskClick = (task: TaskOut) => {
    setSelectedTask(task)
    // TODO: Abrir vista de detalle en modal o panel lateral
    console.log('Ver detalle:', task)
  }

  const handleModalSuccess = () => {
    setRefreshKey((prev) => prev + 1) // Trigger reload
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Estadísticas */}
      <TasksStats key={`stats-${refreshKey}`} />

      {/* Tabla de Tareas */}
      <TasksTable
        key={`table-${refreshKey}`}
        onTaskClick={handleTaskClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onCreateClick={handleCreateClick}
      />

      {/* Modal Crear/Editar */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        task={editingTask}
      />
    </div>
  )
}
