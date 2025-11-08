import api from '@/lib/axios'

export interface Contact {
  id: number
  full_name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  industry_template: string
  custom_fields: Record<string, any>
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ContactCreate {
  full_name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  industry_template?: string
  custom_fields?: Record<string, any>
  tags?: string[]
}

export const contactsService = {
  async getAll(skip = 0, limit = 100) {
    const response = await api.get<Contact[]>('/contacts', {
      params: { skip, limit },
    })
    return response.data
  },

  async getById(id: number) {
    const response = await api.get<Contact>(`/contacts/${id}`)
    return response.data
  },

  async create(data: ContactCreate) {
    const response = await api.post<Contact>('/contacts', data)
    return response.data
  },

  async update(id: number, data: Partial<ContactCreate>) {
    const response = await api.put<Contact>(`/contacts/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    await api.delete(`/contacts/${id}`)
  },
}
