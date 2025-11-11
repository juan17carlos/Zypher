// frontend/src/types/deal.ts - Tipos TypeScript para Deals (Phase 3)

// Enums para Deal (MAYÚSCULAS para coincidir con backend)
export type DealStage = 'LEAD' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST'

export type DealPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type DealSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'COLD_CALL'
  | 'SOCIAL_MEDIA'
  | 'EMAIL_CAMPAIGN'
  | 'EVENT'
  | 'PARTNER'
  | 'OTHER'

// Interface base para Deal
export interface DealBase {
  title: string
  description: string | null
  value: number
  currency: string
  stage: DealStage
  probability: number
  priority: DealPriority
  source: DealSource | null
  expected_close_date: string | null
  actual_close_date: string | null
  lost_reason: string | null
  tags: string[]
  custom_fields: Record<string, any>
  is_active: boolean
}

// Interface para crear Deal
export interface DealCreate extends DealBase {
  contact_id: string
}

// Interface para actualizar Deal
export interface DealUpdate extends Partial<DealBase> {}

// Interface para Deal completo (respuesta del servidor)
export interface DealOut extends DealBase {
  id: string
  contact_id: string
  owner_id: number
  created_at: string
  updated_at: string
  // Opcional: información del contacto y owner cuando se incluyen
  contact?: {
    id: string
    full_name: string
    email?: string | null
    phone?: string | null
    mobile?: string | null
    company?: string | null
  }
  owner?: {
    id: number
    full_name: string
    email: string
  }
}

// Interface para Deal con información del contacto
export interface DealWithContact extends DealOut {
  contact_name: string | null
  contact_email: string | null
  contact_company: string | null
}

// Interface para respuesta paginada
export interface DealsPaginatedResponse {
  items: DealOut[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Interface para estadísticas de deals
export interface DealStats {
  total_deals: number
  active_deals: number
  won_deals: number
  lost_deals: number
  total_value: number
  won_value: number
  potential_value: number
  average_deal_value: number
  average_win_probability: number
  deals_by_stage: Record<DealStage, number>
  value_by_stage: Record<DealStage, number>
  deals_by_priority: Record<DealPriority, number>
  deals_by_source: Record<DealSource, number>
  win_rate: number
  conversion_rate: number
}

// Interface para actualizar etapa
export interface DealStageUpdate {
  stage: DealStage
  probability?: number
  lost_reason?: string
}

// Interface para resumen del pipeline
export interface PipelineStageData {
  stage: DealStage
  count: number
  total_value: number
  deals: DealOut[]
}

export type PipelineSummary = Record<DealStage, PipelineStageData>

// Labels para las etapas
export const StageLabels: Record<DealStage, string> = {
  LEAD: 'Lead',
  CONTACTED: 'Contactado',
  QUALIFIED: 'Calificado',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  WON: 'Ganado',
  LOST: 'Perdido',
}

// Labels para prioridades
export const PriorityLabels: Record<DealPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

// Labels para fuentes
export const SourceLabels: Record<DealSource, string> = {
  WEBSITE: 'Sitio Web',
  REFERRAL: 'Referido',
  COLD_CALL: 'Llamada en Frío',
  SOCIAL_MEDIA: 'Redes Sociales',
  EMAIL_CAMPAIGN: 'Campaña Email',
  EVENT: 'Evento',
  PARTNER: 'Socio/Partner',
  OTHER: 'Otro',
}

// Opciones para selects
export const STAGE_OPTIONS = Object.entries(StageLabels).map(([value, label]) => ({
  value: value as DealStage,
  label,
}))

export const PRIORITY_OPTIONS = Object.entries(PriorityLabels).map(([value, label]) => ({
  value: value as DealPriority,
  label,
}))

export const SOURCE_OPTIONS = Object.entries(SourceLabels).map(([value, label]) => ({
  value: value as DealSource,
  label,
}))

// Colores para etapas (para UI)
export const StageColors: Record<DealStage, string> = {
  LEAD: 'gray',
  CONTACTED: 'blue',
  QUALIFIED: 'cyan',
  PROPOSAL: 'purple',
  NEGOTIATION: 'orange',
  WON: 'green',
  LOST: 'red',
}

// Colores para prioridades
export const PriorityColors: Record<DealPriority, string> = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  URGENT: 'red',
}

// Probabilidades sugeridas por etapa
export const StageProbabilities: Record<DealStage, number> = {
  LEAD: 10,
  CONTACTED: 20,
  QUALIFIED: 40,
  PROPOSAL: 60,
  NEGOTIATION: 80,
  WON: 100,
  LOST: 0,
}
