// frontend/src/types/task.ts - Tipos TypeScript para Tasks

// Enums para Task
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// Interface base para Task
export interface TaskBase {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
}

// Interface para crear Task
export interface TaskCreate extends TaskBase {
  contact_id?: number | null
  deal_id?: number | null
}

// Interface para actualizar Task
export interface TaskUpdate extends Partial<TaskBase> {
  contact_id?: number | null
  deal_id?: number | null
}

// Interface para Task completa (respuesta del servidor)
export interface TaskOut extends TaskBase {
  id: number
  assigned_to_id: number
  contact_id: number | null
  deal_id: number | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Interface para Task con información adicional
export interface TaskWithDetails extends TaskOut {
  contact_name: string | null
  deal_title: string | null
  assigned_to_name: string | null
}

// Interface para respuesta paginada
export interface TasksPaginatedResponse {
  items: TaskOut[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Interface para estadísticas de tasks
export interface TaskStats {
  total_tasks: number
  pending_tasks: number
  in_progress_tasks: number
  completed_tasks: number
  cancelled_tasks: number
  tasks_by_priority: Record<TaskPriority, number>
  tasks_by_status: Record<TaskStatus, number>
  overdue_tasks: number
  due_today: number
  due_this_week: number
  completion_rate: number
}

// Labels para los estados
export const StatusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

// Labels para prioridades
export const PriorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

// Opciones para selects
export const STATUS_OPTIONS = Object.entries(StatusLabels).map(([value, label]) => ({
  value: value as TaskStatus,
  label,
}))

export const PRIORITY_OPTIONS = Object.entries(PriorityLabels).map(([value, label]) => ({
  value: value as TaskPriority,
  label,
}))

// Colores para estados (para UI)
export const StatusColors: Record<TaskStatus, string> = {
  pending: 'gray',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'red',
}

// Colores para prioridades
export const PriorityColors: Record<TaskPriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
}

// Iconos para estados
export const StatusIcons: Record<TaskStatus, string> = {
  pending: 'CircleDashed',
  in_progress: 'Loader2',
  completed: 'CheckCircle2',
  cancelled: 'XCircle',
}

// Iconos para prioridades
export const PriorityIcons: Record<TaskPriority, string> = {
  low: 'ArrowDown',
  medium: 'Minus',
  high: 'ArrowUp',
  urgent: 'AlertTriangle',
}
