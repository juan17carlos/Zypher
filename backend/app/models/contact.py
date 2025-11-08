# backend/app/models/contact.py - Modelo de Contactos con estándares del proyecto

from sqlalchemy import Column, String, Boolean, ForeignKey, JSON, Enum as SQLEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
import uuid

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
    SALON = "salon"
    LEGAL = "legal"
    CONSTRUCTION = "construction"


class Contact(BaseModel):
    """
    Modelo de contactos/clientes del CRM
    Compatible con múltiples industrias mediante templates
    """
    __tablename__ = "contacts"

    # ID primario (heredado de BaseModel pero redefinimos si BaseModel no lo tiene)
    # Si BaseModel ya tiene id como UUID, comentar esta línea
    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Relación con usuario propietario (quien creó el contacto)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Información básica - anchos definidos según estándares
    full_name = Column(String(300), nullable=False, index=True)
    email = Column(String(120), nullable=True, index=True)
    phone = Column(String(15), nullable=True)
    mobile = Column(String(15), nullable=True)

    # Información empresarial
    company = Column(String(300), nullable=True)
    position = Column(String(150), nullable=True)
    website = Column(String(200), nullable=True)

    # Ubicación - anchos alineados con estándares
    address = Column(String(300), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True, default="Ecuador")
    zip_code = Column(String(10), nullable=True)

    # Template de industria
    industry_template = Column(
        SQLEnum(IndustryTemplate),
        default=IndustryTemplate.GENERIC,
        nullable=False,
        index=True
    )

    # Campos personalizados por industria (JSON flexible)
    # Ejemplo para REAL_ESTATE: {"budget": 500000, "property_type": "house"}
    # Ejemplo para MEDICAL: {"insurance": "Seguros XYZ", "blood_type": "O+"}
    custom_fields = Column(JSON, nullable=True, default=dict)

    # Tags para categorización
    tags = Column(JSON, nullable=True, default=list)

    # Notas generales
    notes = Column(Text, nullable=True)

    # Estado
    is_active = Column(Boolean, default=True, nullable=False)

    # Relaciones (comentadas hasta crear los modelos relacionados)
    owner = relationship("User", foreign_keys=[owner_id], backref="contacts_owned")
    # deals = relationship("Deal", back_populates="contact")
    # tasks = relationship("Task", back_populates="contact")
    # notes_relation = relationship("Note", back_populates="contact")

    def __repr__(self):
        return f"<Contact {self.full_name} ({self.industry_template.value})>"

    def to_dict(self):
        """Convertir modelo a diccionario"""
        return {
            "id": str(self.id) if self.id else None,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "mobile": self.mobile,
            "company": self.company,
            "position": self.position,
            "website": self.website,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "zip_code": self.zip_code,
            "industry_template": self.industry_template.value if self.industry_template else None,
            "custom_fields": self.custom_fields or {},
            "tags": self.tags or [],
            "notes": self.notes,
            "is_active": self.is_active,
            "owner_id": str(self.owner_id) if self.owner_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
