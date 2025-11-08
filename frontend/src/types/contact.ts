// frontend/src/types/contact.ts - Tipos completos para Contactos

export enum IndustryTemplate {
  GENERIC = "generic",
  REAL_ESTATE = "real_estate",
  MEDICAL = "medical",
  AUTOMOTIVE = "automotive",
  FITNESS = "fitness",
  RESTAURANT = "restaurant",
  EDUCATION = "education",
  SALON = "salon",
  LEGAL = "legal",
  CONSTRUCTION = "construction",
}

export const IndustryLabels: Record<IndustryTemplate, string> = {
  [IndustryTemplate.GENERIC]: "General",
  [IndustryTemplate.REAL_ESTATE]: "Bienes Raíces",
  [IndustryTemplate.MEDICAL]: "Médico/Salud",
  [IndustryTemplate.AUTOMOTIVE]: "Automotriz",
  [IndustryTemplate.FITNESS]: "Fitness/Gimnasio",
  [IndustryTemplate.RESTAURANT]: "Restaurante/Comida",
  [IndustryTemplate.EDUCATION]: "Educación",
  [IndustryTemplate.SALON]: "Salón de Belleza",
  [IndustryTemplate.LEGAL]: "Legal/Abogacía",
  [IndustryTemplate.CONSTRUCTION]: "Construcción",
}

// Contact interfaces
export interface ContactBase {
  full_name: string
  email?: string | null
  phone?: string | null
  mobile?: string | null
  company?: string | null
  position?: string | null
  website?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country: string
  zip_code?: string | null
  industry_template: IndustryTemplate
  custom_fields?: Record<string, any>
  tags?: string[]
  notes?: string | null
  is_active: boolean
}

export interface ContactCreate extends ContactBase {}

export interface ContactUpdate extends Partial<ContactBase> {}

export interface ContactOut extends ContactBase {
  id: string
  owner_id: string
  created_at: string
  updated_at: string
  display_name?: string
  contact_methods?: string[]
}

export interface ContactInDB extends ContactOut {}

// Pagination and stats
export interface ContactStats {
  total_contacts: number
  active_contacts: number
  inactive_contacts: number
  by_industry: Record<string, number>
  by_country: Record<string, number>
  recent_contacts: number
}

export interface ContactsPaginatedResponse {
  items: ContactOut[]
  total: number
  page: number
  size: number
  pages: number
  has_more?: boolean
  global_stats?: ContactStats
}

// Query params
export interface ContactsQueryParams {
  skip?: number
  limit?: number
  search?: string
  industry?: IndustryTemplate
  country?: string
  is_active?: boolean
  tags?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}

// Import/Export
export interface ContactImportRow {
  full_name: string
  email?: string
  phone?: string
  mobile?: string
  company?: string
  position?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country: string
  zip_code?: string
  industry_template: string
  tags?: string
  notes?: string
}

export interface ContactImportResult {
  success: boolean
  total_rows: number
  imported: number
  failed: number
  errors: Array<{
    row?: number
    email?: string
    error: string
  }>
  warnings: string[]
}

export interface ContactExportRequest {
  format: "csv" | "excel"
  filters?: ContactsQueryParams
  fields?: string[]
}

// UI Helper types
export interface ContactFormData extends ContactBase {
  id?: string
}

export interface ContactFilters {
  search: string
  industry: IndustryTemplate | "all"
  country: string
  is_active: boolean | "all"
  tags: string[]
}

// Constants
export const DEFAULT_CONTACT_FILTERS: ContactFilters = {
  search: "",
  industry: "all",
  country: "",
  is_active: "all",
  tags: [],
}

export const CONTACT_SORT_OPTIONS = [
  { value: "created_at", label: "Fecha de Creación" },
  { value: "full_name", label: "Nombre" },
  { value: "company", label: "Empresa" },
  { value: "email", label: "Email" },
  { value: "updated_at", label: "Última Actualización" },
]

export const INDUSTRIES_OPTIONS = Object.entries(IndustryLabels).map(([value, label]) => ({
  value,
  label,
}))
