// frontend/src/services/contactsService.ts - Servicio completo para Contactos

import api from '@/lib/axios'
import type {
  ContactOut,
  ContactCreate,
  ContactUpdate,
  ContactsQueryParams,
  ContactsPaginatedResponse,
  ContactStats,
  ContactImportResult,
} from '@/types/contact'

class ContactService {
  private readonly baseUrl = '/contacts/'

  /**
   * Obtener lista paginada de contactos con filtros y estadísticas
   */
  async getAllWithPagination(params?: ContactsQueryParams): Promise<ContactsPaginatedResponse> {
    try {
      const response = await api.get<ContactsPaginatedResponse>(this.baseUrl, {
        params,
      })

      console.log('Contactos obtenidos:', {
        totalItems: response.data.total,
        itemsInPage: response.data.items.length,
        globalStats: response.data.global_stats,
        page: response.data.page,
      })

      return response.data
    } catch (error: any) {
      console.error('Error obteniendo contactos:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtener contacto por ID
   */
  async getById(id: string): Promise<ContactOut> {
    try {
      const response = await api.get<ContactOut>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error obteniendo contacto:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Crear nuevo contacto
   */
  async create(data: ContactCreate): Promise<ContactOut> {
    try {
      const response = await api.post<ContactOut>(this.baseUrl, data)
      console.log('Contacto creado:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error creando contacto:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Actualizar contacto existente
   */
  async update(id: string, data: ContactUpdate): Promise<ContactOut> {
    try {
      const response = await api.put<ContactOut>(`${this.baseUrl}/${id}`, data)
      console.log('Contacto actualizado:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error actualizando contacto:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Eliminar contacto
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`)
      console.log('Contacto eliminado:', id)
    } catch (error: any) {
      console.error('Error eliminando contacto:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtener estadísticas de contactos
   */
  async getStats(): Promise<ContactStats> {
    try {
      const response = await api.get<ContactStats>(`${this.baseUrl}/stats/overview`)
      return response.data
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Exportar contactos a CSV
   */
  async exportToCSV(params?: Partial<ContactsQueryParams>): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export/csv`, {
        params,
        responseType: 'blob',
      })

      console.log('Contactos exportados a CSV')
      return response.data
    } catch (error: any) {
      console.error('Error exportando contactos:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Importar contactos desde CSV
   */
  async importFromCSV(fileContent: string): Promise<ContactImportResult> {
    try {
      const response = await api.post<ContactImportResult>(
        `${this.baseUrl}/import/csv`,
        { file_content: fileContent },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('Importación completada:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error importando contactos:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Búsqueda rápida de contactos
   */
  async search(query: string, limit: number = 10): Promise<ContactOut[]> {
    try {
      const response = await this.getAllWithPagination({
        search: query,
        limit,
        skip: 0,
      })

      return response.items
    } catch (error: any) {
      console.error('Error buscando contactos:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Activar/desactivar contacto
   */
  async toggleActive(id: string, isActive: boolean): Promise<ContactOut> {
    try {
      return await this.update(id, { is_active: isActive })
    } catch (error: any) {
      console.error('Error cambiando estado del contacto:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtener contactos por industria
   */
  async getByIndustry(industry: string, limit: number = 50): Promise<ContactOut[]> {
    try {
      const response = await this.getAllWithPagination({
        industry: industry as any,
        limit,
        skip: 0,
      })

      return response.items
    } catch (error: any) {
      console.error('Error obteniendo contactos por industria:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Obtener contactos por país
   */
  async getByCountry(country: string, limit: number = 50): Promise<ContactOut[]> {
    try {
      const response = await this.getAllWithPagination({
        country,
        limit,
        skip: 0,
      })

      return response.items
    } catch (error: any) {
      console.error('Error obteniendo contactos por país:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Error con respuesta del servidor
      const message = error.response.data?.detail || error.response.data?.message || 'Error en el servidor'

      return new Error(message)
    } else if (error.request) {
      // Error de red
      return new Error('No se pudo conectar con el servidor')
    } else {
      // Error desconocido
      return new Error(error.message || 'Error desconocido')
    }
  }
}

// Exportar instancia singleton
export const contactService = new ContactService()

// Export default para compatibilidad
export default contactService
