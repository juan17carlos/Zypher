// frontend/src/pages/TasksPageNew.tsx - Página de Tasks rediseñada

import { useState } from 'react'
import { Plus } from 'lucide-react'
import TasksTableNew from '@/components/tasks/TasksTableNew'
import TaskModalNew from '@/components/tasks/TaskModalNew'
import type { TaskOut } from '@/types/task'

export default function TasksPageNew() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskOut | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreate = () => {
    setSelectedTask(null)
    setModalOpen(true)
  }

  const handleEdit = (task: TaskOut) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTask(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tareas</h1>
          <p className="text-sm text-gray-600 dark:text-dark-300 mt-1">
            Gestiona tus tareas y actividades
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Tarea</span>
          </button>
        </div>
      </div>

      {/* Content - Tabla */}
      <div className="flex-1 overflow-auto">
        <TasksTableNew
          key={refreshKey}
          onTaskClick={(task) => handleEdit(task)}
          onEditClick={handleEdit}
          onCreateClick={handleCreate}
        />
      </div>

      {/* Modal */}
      <TaskModalNew
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        task={selectedTask}
      />
    </div>
  )
}
