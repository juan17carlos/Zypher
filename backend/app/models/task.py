from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class TaskPriority(str, enum.Enum):
    """Prioridad de la tarea"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskStatus(str, enum.Enum):
    """Estado de la tarea"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Task(BaseModel):
    """Modelo de tarea"""
    __tablename__ = "tasks"

    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)

    # Estado y prioridad
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    priority = Column(SQLEnum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)

    # Fechas
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Relaciones
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=True)

    # assigned_to = relationship("User", back_populates="tasks")
    # contact = relationship("Contact", back_populates="tasks")
    # deal = relationship("Deal", back_populates="tasks")

    def __repr__(self):
        return f"<Task {self.title} - {self.status}>"
