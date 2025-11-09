// frontend/src/services/tasksService.ts - Servicio API para Tasks

import api from '@/lib/axios'
import type {
  TaskCreate,
  TaskUpdate,
  TaskOut,
  TasksPaginatedResponse,
  TaskStats,
  TaskWithDetails,
  TaskStatus,
  TaskPriority,
} from '@/types/task'

class TasksService {
  private baseURL = '/tasks/'

  /**
   * Obtener tasks paginadas con filtros
   */
  async getAllWithPagination(params: {
    page?: number
    page_size?: number
    search?: string
    status?: TaskStatus
    priority?: TaskPriority
    contact_id?: number
    deal_id?: number
    overdue?: boolean
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<TasksPaginatedResponse> {
    try {
      const response = await api.get<TasksPaginatedResponse>(this.baseURL, { params })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener tasks')
    }
  }

  /**
   * Obtener estadísticas de tasks
   */
  async getStats(): Promise<TaskStats> {
    try {
      const response = await api.get<TaskStats>(`${this.baseURL}stats`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener estadísticas')
    }
  }

  /**
   * Obtener una task por ID (con detalles)
   */
  async getById(id: number): Promise<TaskWithDetails> {
    try {
      const response = await api.get<TaskWithDetails>(`${this.baseURL}${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener task')
    }
  }

  /**
   * Crear nueva task
   */
  async create(data: TaskCreate): Promise<TaskOut> {
    try {
      const response = await api.post<TaskOut>(this.baseURL, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al crear task')
    }
  }

  /**
   * Actualizar task
   */
  async update(id: number, data: TaskUpdate): Promise<TaskOut> {
    try {
      const response = await api.put<TaskOut>(`${this.baseURL}${id}`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al actualizar task')
    }
  }

  /**
   * Eliminar task
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseURL}${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al eliminar task')
    }
  }

  /**
   * Marcar task como completada
   */
  async markAsCompleted(id: number): Promise<TaskOut> {
    try {
      const response = await api.put<TaskOut>(`${this.baseURL}${id}`, {
        status: 'completed'
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al completar task')
    }
  }

  /**
   * Formatear fecha
   */
  formatDate(date: string | null): string {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  /**
   * Formatear fecha y hora
   */
  formatDateTime(date: string | null): string {
    if (!date) return '-'
    return new Date(date).toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /**
   * Calcular días hasta vencimiento
   */
  getDaysUntilDue(dueDate: string | null): number | null {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  /**
   * Verificar si la task está vencida
   */
  isOverdue(task: TaskOut): boolean {
    if (!task.due_date) return false
    if (task.status === 'completed' || task.status === 'cancelled') return false
    const days = this.getDaysUntilDue(task.due_date)
    return days !== null && days < 0
  }

  /**
   * Verificar si vence hoy
   */
  isDueToday(task: TaskOut): boolean {
    if (!task.due_date) return false
    const days = this.getDaysUntilDue(task.due_date)
    return days === 0
  }
}

// Exportar instancia singleton
const tasksService = new TasksService()
export default tasksService
