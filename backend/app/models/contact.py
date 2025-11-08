from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class IndustryTemplate(str, enum.Enum):
    """Templates de industria disponibles"""
    GENERIC = "generic"
    REAL_ESTATE = "real_estate"
    MEDICAL = "medical"
    AUTOMOTIVE = "automotive"
    FITNESS = "fitness"
    RESTAURANT = "restaurant"
    EDUCATION = "education"


class Contact(BaseModel):
    """Modelo de contacto/cliente"""
    __tablename__ = "contacts"

    # Campos básicos
    full_name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    position = Column(String, nullable=True)

    # Ubicación
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)

    # Template de industria
    industry_template = Column(
        SQLEnum(IndustryTemplate),
        default=IndustryTemplate.GENERIC,
        nullable=False
    )

    # Campos personalizados por industria (JSON flexible)
    custom_fields = Column(JSON, nullable=True, default={})

    # Tags y categorización
    tags = Column(JSON, nullable=True, default=[])

    # Relación con usuario que lo creó
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # owner = relationship("User", back_populates="contacts")

    # Relaciones
    # deals = relationship("Deal", back_populates="contact")
    # notes = relationship("Note", back_populates="contact")

    def __repr__(self):
        return f"<Contact {self.full_name}>"
