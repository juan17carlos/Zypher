# backend/app/schemas/task.py - Schemas completos para Tasks

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List

from app.models.task import TaskStatus, TaskPriority


# Schema base para Task
class TaskBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=300, description="Título de la tarea")
    description: Optional[str] = Field(None, description="Descripción detallada")
    status: TaskStatus = Field(default=TaskStatus.PENDING, description="Estado de la tarea")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Prioridad")
    due_date: Optional[datetime] = Field(None, description="Fecha de vencimiento")

    @field_validator("status", "priority", mode="before")
    @classmethod
    def normalize_enums(cls, v):
        """Normaliza enums a mayúsculas"""
        if isinstance(v, str):
            return v.upper()
        return v


# Schema para crear Task
class TaskCreate(TaskBase):
    contact_id: Optional[int] = Field(None, description="ID del contacto asociado")
    deal_id: Optional[int] = Field(None, description="ID del deal asociado")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError('El título es obligatorio')
        return v.strip()


# Schema para actualizar Task
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=300)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    contact_id: Optional[int] = None
    deal_id: Optional[int] = None

    @field_validator("status", "priority", mode="before")
    @classmethod
    def normalize_enums(cls, v):
        """Normaliza enums a mayúsculas"""
        if isinstance(v, str):
            return v.upper()
        return v


# Schema para respuesta de Task
class TaskOut(TaskBase):
    id: int
    assigned_to_id: int
    contact_id: Optional[int] = None
    deal_id: Optional[int] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema para Task con información adicional
class TaskWithDetails(TaskOut):
    contact_name: Optional[str] = None
    deal_title: Optional[str] = None
    assigned_to_name: Optional[str] = None


# Schema para paginación de Tasks
class TasksPaginatedResponse(BaseModel):
    items: List[TaskOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# Schema para estadísticas de Tasks
class TaskStats(BaseModel):
    # Totales
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    cancelled_tasks: int

    # Por prioridad
    tasks_by_priority: dict  # {priority: count}

    # Por estado
    tasks_by_status: dict  # {status: count}

    # Vencimiento
    overdue_tasks: int
    due_today: int
    due_this_week: int

    # Porcentajes
    completion_rate: float  # Porcentaje de tareas completadas
