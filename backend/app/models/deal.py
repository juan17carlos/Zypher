from sqlalchemy import Column, String, Text, ForeignKey, Float, Date, Enum as SQLEnum, JSON, Boolean, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import enum
import uuid

from app.models.base import BaseModel


class DealStage(str, enum.Enum):
    """Etapas del pipeline de ventas"""
    LEAD = "LEAD"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    PROPOSAL = "PROPOSAL"
    NEGOTIATION = "NEGOTIATION"
    WON = "WON"
    LOST = "LOST"


class DealPriority(str, enum.Enum):
    """Prioridad del deal"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class DealSource(str, enum.Enum):
    """Fuente de origen del deal"""
    WEBSITE = "WEBSITE"
    REFERRAL = "REFERRAL"
    COLD_CALL = "COLD_CALL"
    SOCIAL_MEDIA = "SOCIAL_MEDIA"
    EMAIL_CAMPAIGN = "EMAIL_CAMPAIGN"
    EVENT = "EVENT"
    PARTNER = "PARTNER"
    OTHER = "OTHER"


class Deal(BaseModel):
    """Modelo de negocio/oportunidad en el pipeline - PHASE 3"""
    __tablename__ = "deals"

    # Cambiamos a UUID para mejor escalabilidad
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Información básica
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=True)

    # Valor del negocio
    value = Column(Float, default=0.0, nullable=False, index=True)
    currency = Column(String(10), default="USD", nullable=False)

    # Etapa en el pipeline
    stage = Column(SQLEnum(DealStage), default=DealStage.LEAD, nullable=False, index=True)

    # Probabilidad de cierre (0-100)
    probability = Column(Integer, default=0, nullable=False)

    # Prioridad del deal
    priority = Column(SQLEnum(DealPriority), default=DealPriority.MEDIUM, nullable=False)

    # Fuente de origen
    source = Column(SQLEnum(DealSource), default=DealSource.OTHER, nullable=True)

    # Fechas importantes
    expected_close_date = Column(Date, nullable=True, index=True)
    actual_close_date = Column(Date, nullable=True)

    # Motivo de pérdida (si stage = LOST)
    lost_reason = Column(String(500), nullable=True)

    # Tags para categorización
    tags = Column(JSON, nullable=True, default=list)

    # Campos personalizados (JSON flexible)
    custom_fields = Column(JSON, nullable=True, default=dict)

    # Estado activo
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Relaciones (UUID en lugar de Integer)
    contact_id = Column(UUID(as_uuid=True), ForeignKey("contacts.id"), nullable=False, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Relationships (comentadas por ahora, activar cuando se implementen back_populates)
    # contact = relationship("Contact", back_populates="deals")
    # owner = relationship("User", back_populates="deals")
    # tasks = relationship("Task", back_populates="deal", cascade="all, delete-orphan")
    # notes = relationship("Note", back_populates="deal", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Deal {self.title} - {self.stage} - ${self.value}>"
