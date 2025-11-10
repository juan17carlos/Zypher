# backend/app/schemas/deal.py - Schemas para Deals (Phase 3)

from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional, List

from app.models.deal import DealStage, DealPriority, DealSource


# Schema base para Deal
class DealBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=300, description="Título del deal")
    description: Optional[str] = Field(None, description="Descripción detallada")
    value: float = Field(default=0.0, ge=0, description="Valor monetario del deal")
    currency: str = Field(default="USD", max_length=10, description="Moneda (USD, EUR, etc)")
    stage: DealStage = Field(default=DealStage.LEAD, description="Etapa del pipeline")
    probability: int = Field(default=0, ge=0, le=100, description="Probabilidad de cierre (%)")
    priority: DealPriority = Field(default=DealPriority.MEDIUM, description="Prioridad")
    source: Optional[DealSource] = Field(None, description="Fuente de origen")
    expected_close_date: Optional[date] = Field(None, description="Fecha estimada de cierre")
    actual_close_date: Optional[date] = Field(None, description="Fecha real de cierre")
    lost_reason: Optional[str] = Field(None, max_length=500, description="Motivo de pérdida")
    tags: List[str] = Field(default_factory=list, description="Tags del deal")
    custom_fields: dict = Field(default_factory=dict, description="Campos personalizados")
    is_active: bool = Field(default=True, description="Estado activo")

    @field_validator("stage", "priority", "source", mode="before")
    @classmethod
    def normalize_enums(cls, v):
        """Normaliza enums a mayúsculas"""
        if isinstance(v, str):
            return v.upper()
        return v


# Schema para crear Deal
class DealCreate(DealBase):
    contact_id: int = Field(..., description="ID del contacto asociado")

    @field_validator('probability')
    @classmethod
    def validate_probability(cls, v):
        if v < 0 or v > 100:
            raise ValueError('La probabilidad debe estar entre 0 y 100')
        return v

    @field_validator('value')
    @classmethod
    def validate_value(cls, v):
        if v < 0:
            raise ValueError('El valor no puede ser negativo')
        return v


# Schema para actualizar Deal
class DealUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=300)
    description: Optional[str] = None
    value: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=10)
    stage: Optional[DealStage] = None
    probability: Optional[int] = Field(None, ge=0, le=100)
    priority: Optional[DealPriority] = None
    source: Optional[DealSource] = None
    expected_close_date: Optional[date] = None
    actual_close_date: Optional[date] = None
    lost_reason: Optional[str] = Field(None, max_length=500)
    tags: Optional[List[str]] = None
    custom_fields: Optional[dict] = None
    is_active: Optional[bool] = None

    @field_validator("stage", "priority", "source", mode="before")
    @classmethod
    def normalize_enums(cls, v):
        """Normaliza enums a mayúsculas"""
        if isinstance(v, str):
            return v.upper()
        return v


# Schema para respuesta de Deal
class DealOut(DealBase):
    id: int
    contact_id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema para Deal con información del contacto
class DealWithContact(DealOut):
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_company: Optional[str] = None


# Schema para paginación de Deals
class DealsPaginatedResponse(BaseModel):
    items: List[DealOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# Schema para estadísticas de Deals
class DealStats(BaseModel):
    # Totales
    total_deals: int
    active_deals: int
    won_deals: int
    lost_deals: int

    # Valor total
    total_value: float
    won_value: float
    potential_value: float

    # Promedio
    average_deal_value: float
    average_win_probability: float

    # Por etapa
    deals_by_stage: dict  # {stage: count}
    value_by_stage: dict  # {stage: total_value}

    # Por prioridad
    deals_by_priority: dict  # {priority: count}

    # Por fuente
    deals_by_source: dict  # {source: count}

    # Conversión
    win_rate: float  # Porcentaje de deals ganados
    conversion_rate: float  # Porcentaje de leads convertidos


# Schema para mover deal en el pipeline
class DealStageUpdate(BaseModel):
    stage: DealStage
    probability: Optional[int] = Field(None, ge=0, le=100)
    lost_reason: Optional[str] = Field(None, max_length=500)
