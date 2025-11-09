# app/schemas/pagination.py - Schemas de paginación genéricos para Zypher CRM

from typing import TypeVar, Generic, List, Optional, Dict, Any
from pydantic import BaseModel

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Respuesta paginada genérica para API endpoints - Compatible con Pydantic v2"""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
    has_more: Optional[bool] = None

    class Config:
        arbitrary_types_allowed = True


class PaginatedResponseWithStats(BaseModel, Generic[T]):
    """Respuesta paginada con estadísticas globales para endpoints que las requieren"""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
    has_more: Optional[bool] = None
    global_stats: Optional[Dict[str, Any]] = None

    class Config:
        arbitrary_types_allowed = True


# Schemas específicos para diferentes módulos del CRM
class ContactStats(BaseModel):
    """Estadísticas específicas para contactos"""
    total: int
    active: int
    inactive: int
    by_industry: Dict[str, int]
    by_country: Dict[str, int]
    recent: int  # Últimos 7 días


class ContactsPaginatedResponse(BaseModel):
    """Respuesta paginada específica para contactos con sus estadísticas"""
    items: List[Any]  # Se especificará como List[ContactOut] en el endpoint
    total: int
    page: int
    size: int
    pages: int
    has_more: Optional[bool] = None
    global_stats: Optional[ContactStats] = None

    class Config:
        arbitrary_types_allowed = True


class DealStats(BaseModel):
    """Estadísticas específicas para deals/oportunidades"""
    total: int
    by_status: Dict[str, int]
    total_value: float
    won_value: float
    lost_value: float
    in_progress_value: float
    avg_deal_value: float


class DealsPaginatedResponse(BaseModel):
    """Respuesta paginada específica para deals con sus estadísticas"""
    items: List[Any]  # Se especificará como List[DealOut] en el endpoint
    total: int
    page: int
    size: int
    pages: int
    has_more: Optional[bool] = None
    global_stats: Optional[DealStats] = None

    class Config:
        arbitrary_types_allowed = True


class TaskStats(BaseModel):
    """Estadísticas específicas para tareas"""
    total: int
    by_status: Dict[str, int]
    by_priority: Dict[str, int]
    overdue: int
    due_today: int
    due_this_week: int


class TasksPaginatedResponse(BaseModel):
    """Respuesta paginada específica para tareas con sus estadísticas"""
    items: List[Any]  # Se especificará como List[TaskOut] en el endpoint
    total: int
    page: int
    size: int
    pages: int
    has_more: Optional[bool] = None
    global_stats: Optional[TaskStats] = None

    class Config:
        arbitrary_types_allowed = True


__all__ = [
    'PaginatedResponse',
    'PaginatedResponseWithStats',
    'ContactStats',
    'ContactsPaginatedResponse',
    'DealStats',
    'DealsPaginatedResponse',
    'TaskStats',
    'TasksPaginatedResponse',
]
