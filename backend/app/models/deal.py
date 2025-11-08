from sqlalchemy import Column, String, Integer, ForeignKey, Float, Date, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class DealStage(str, enum.Enum):
    """Etapas del pipeline de ventas"""
    LEAD = "lead"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    WON = "won"
    LOST = "lost"


class Deal(BaseModel):
    """Modelo de negocio/oportunidad en el pipeline"""
    __tablename__ = "deals"

    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)

    # Valor del negocio
    value = Column(Float, default=0.0, nullable=False)
    currency = Column(String, default="USD", nullable=False)

    # Etapa en el pipeline
    stage = Column(SQLEnum(DealStage), default=DealStage.LEAD, nullable=False)

    # Probabilidad de cierre (0-100)
    probability = Column(Integer, default=0, nullable=False)

    # Fecha estimada de cierre
    expected_close_date = Column(Date, nullable=True)

    # Campos personalizados
    custom_fields = Column(JSON, nullable=True, default={})

    # Relaciones
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # contact = relationship("Contact", back_populates="deals")
    # owner = relationship("User", back_populates="deals")
    # tasks = relationship("Task", back_populates="deal")
    # notes = relationship("Note", back_populates="deal")

    def __repr__(self):
        return f"<Deal {self.title} - {self.stage}>"
