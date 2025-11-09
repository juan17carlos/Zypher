// frontend/src/services/dealsService.ts - Servicio API para Deals (Phase 3)

import api from './api'
import type {
  DealCreate,
  DealUpdate,
  DealOut,
  DealsPaginatedResponse,
  DealStats,
  DealStageUpdate,
  DealWithContact,
  PipelineSummary,
  DealStage,
  DealPriority,
  DealSource,
} from '@/types/deal'

class DealsService {
  private baseURL = '/deals'

  /**
   * Obtener deals paginados con filtros
   */
  async getAllWithPagination(params: {
    page?: number
    page_size?: number
    search?: string
    stage?: DealStage
    priority?: DealPriority
    source?: DealSource
    min_value?: number
    max_value?: number
    is_active?: boolean
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  } = {}): Promise<DealsPaginatedResponse> {
    try {
      const response = await api.get<DealsPaginatedResponse>(this.baseURL, { params })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener deals')
    }
  }

  /**
   * Obtener estadísticas de deals
   */
  async getStats(): Promise<DealStats> {
    try {
      const response = await api.get<DealStats>(`${this.baseURL}/stats`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener estadísticas')
    }
  }

  /**
   * Obtener un deal por ID (con información del contacto)
   */
  async getById(id: string): Promise<DealWithContact> {
    try {
      const response = await api.get<DealWithContact>(`${this.baseURL}/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener deal')
    }
  }

  /**
   * Crear nuevo deal
   */
  async create(data: DealCreate): Promise<DealOut> {
    try {
      const response = await api.post<DealOut>(this.baseURL, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al crear deal')
    }
  }

  /**
   * Actualizar deal
   */
  async update(id: string, data: DealUpdate): Promise<DealOut> {
    try {
      const response = await api.put<DealOut>(`${this.baseURL}/${id}`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al actualizar deal')
    }
  }

  /**
   * Actualizar etapa del deal
   */
  async updateStage(id: string, data: DealStageUpdate): Promise<DealOut> {
    try {
      const response = await api.patch<DealOut>(`${this.baseURL}/${id}/stage`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al actualizar etapa')
    }
  }

  /**
   * Eliminar deal
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al eliminar deal')
    }
  }

  /**
   * Obtener resumen del pipeline (para vista Kanban)
   */
  async getPipelineSummary(): Promise<PipelineSummary> {
    try {
      const response = await api.get<PipelineSummary>(`${this.baseURL}/pipeline/summary`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error al obtener resumen del pipeline')
    }
  }

  /**
   * Formatear valor monetario
   */
  formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: currency,
    }).format(value)
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
   * Calcular días hasta el cierre
   */
  getDaysUntilClose(expectedCloseDate: string | null): number | null {
    if (!expectedCloseDate) return null
    const today = new Date()
    const closeDate = new Date(expectedCloseDate)
    const diff = closeDate.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
}

// Exportar instancia singleton
const dealsService = new DealsService()
export default dealsService
