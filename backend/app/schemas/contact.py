# backend/app/schemas/contact.py - Schemas completos para Contactos

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
import re

# Importaciones robustas con fallback
try:
    from app.models.contact import IndustryTemplate
    ENUMS_AVAILABLE = True
except ImportError:
    import enum

    class IndustryTemplate(str, enum.Enum):
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

    ENUMS_AVAILABLE = False


class ContactBase(BaseModel):
    """Base schema for contact - Estándares del proyecto"""
    full_name: str = Field(..., min_length=1, max_length=300)
    email: Optional[EmailStr] = Field(None, max_length=120)
    phone: Optional[str] = Field(None, max_length=15)
    mobile: Optional[str] = Field(None, max_length=15)

    # Información empresarial
    company: Optional[str] = Field(None, max_length=300)
    position: Optional[str] = Field(None, max_length=150)
    website: Optional[str] = Field(None, max_length=200)

    # Ubicación
    address: Optional[str] = Field(None, max_length=300)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    country: str = Field(default="Ecuador", max_length=100)
    zip_code: Optional[str] = Field(None, max_length=10)

    # Template de industria
    industry_template: IndustryTemplate = Field(default=IndustryTemplate.GENERIC)

    # Campos personalizados por industria
    custom_fields: Optional[Dict[str, Any]] = Field(default_factory=dict)

    # Tags para categorización
    tags: Optional[List[str]] = Field(default_factory=list)

    # Notas generales
    notes: Optional[str] = None

    # Estado
    is_active: bool = Field(default=True)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        """Valida nombre completo"""
        if not v or not v.strip():
            raise ValueError("Nombre completo es obligatorio")

        # Eliminar espacios múltiples y trim
        cleaned = re.sub(r'\s+', ' ', v.strip())

        if len(cleaned) < 2:
            raise ValueError("Nombre debe tener al menos 2 caracteres")

        # Verificar caracteres problemáticos
        problematic_chars = ['<', '>', '"', "'"]
        for char in problematic_chars:
            if char in cleaned:
                raise ValueError(f"No se permite el carácter '{char}' en el nombre")

        return cleaned

    @field_validator("phone", "mobile")
    @classmethod
    def validate_phone_number(cls, v: Optional[str]) -> Optional[str]:
        """Valida números de teléfono - flexible para internacional"""
        if not v:
            return None

        # Solo números, espacios, guiones, paréntesis y +
        cleaned = re.sub(r'[^\d\s\-\(\)\+]', '', v)
        cleaned = cleaned.strip()

        if len(cleaned) == 0:
            return None

        # Extraer solo dígitos para validar longitud
        only_digits = re.sub(r'[^\d]', '', cleaned)

        if len(only_digits) < 7:
            raise ValueError("Teléfono debe tener al menos 7 dígitos")

        if len(only_digits) > 15:
            raise ValueError("Teléfono no puede tener más de 15 dígitos")

        return cleaned

    @field_validator("website")
    @classmethod
    def validate_website(cls, v: Optional[str]) -> Optional[str]:
        """Valida URL de sitio web"""
        if not v:
            return None

        cleaned = v.strip()

        # Validar formato básico de URL
        url_pattern = r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$'
        if not re.match(url_pattern, cleaned, re.IGNORECASE):
            raise ValueError("URL de sitio web inválida")

        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: Optional[EmailStr]) -> Optional[EmailStr]:
        """Validación adicional de email"""
        if not v:
            return None

        # EmailStr de Pydantic ya valida formato básico
        # Aquí podemos agregar validaciones adicionales si es necesario

        return v

    @field_validator("company", "position", "address", "city", "state", "country")
    @classmethod
    def validate_text_fields(cls, v: Optional[str]) -> Optional[str]:
        """Valida campos de texto generales"""
        if not v:
            return None

        # Eliminar espacios múltiples y trim
        cleaned = re.sub(r'\s+', ' ', v.strip())

        # Verificar caracteres problemáticos
        problematic_chars = ['<', '>', '"', "'"]
        for char in problematic_chars:
            if char in cleaned:
                raise ValueError(f"No se permite el carácter '{char}' en este campo")

        return cleaned

    @field_validator("zip_code")
    @classmethod
    def validate_zip_code(cls, v: Optional[str]) -> Optional[str]:
        """Valida código postal"""
        if not v:
            return None

        # Solo alfanumérico y guiones
        cleaned = re.sub(r'[^\w\-]', '', v.strip())

        if len(cleaned) == 0:
            return None

        if len(cleaned) > 10:
            raise ValueError("Código postal no puede tener más de 10 caracteres")

        return cleaned

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v: Optional[List[str]]) -> List[str]:
        """Valida lista de tags"""
        if not v:
            return []

        # Limpiar y filtrar tags vacíos
        cleaned_tags = []
        for tag in v:
            if isinstance(tag, str):
                tag_cleaned = tag.strip()
                if tag_cleaned and len(tag_cleaned) <= 50:
                    cleaned_tags.append(tag_cleaned)

        # Eliminar duplicados manteniendo orden
        seen = set()
        unique_tags = []
        for tag in cleaned_tags:
            tag_lower = tag.lower()
            if tag_lower not in seen:
                seen.add(tag_lower)
                unique_tags.append(tag)

        return unique_tags

    @field_validator("custom_fields")
    @classmethod
    def validate_custom_fields(cls, v: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Valida campos personalizados"""
        if not v:
            return {}

        # Validar que las claves sean strings válidos
        cleaned = {}
        for key, value in v.items():
            if isinstance(key, str):
                key_cleaned = key.strip()
                if key_cleaned and len(key_cleaned) <= 100:
                    cleaned[key_cleaned] = value

        return cleaned

    @model_validator(mode="before")
    @classmethod
    def validate_contact_data(cls, values):
        """Validaciones finales del contacto"""

        # Si no es un diccionario, no validar
        if not isinstance(values, dict):
            return values

        # Al menos un método de contacto (email, phone o mobile)
        has_email = values.get("email") and values.get("email").strip()
        has_phone = values.get("phone") and values.get("phone").strip()
        has_mobile = values.get("mobile") and values.get("mobile").strip()

        if not (has_email or has_phone or has_mobile):
            raise ValueError("Debe proporcionar al menos un método de contacto (email, teléfono o móvil)")

        return values


class ContactCreate(ContactBase):
    """Schema for creating contacts"""
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,
        use_enum_values=True
    )


class ContactUpdate(BaseModel):
    """Schema for updating contacts"""
    full_name: Optional[str] = Field(None, max_length=300)
    email: Optional[EmailStr] = Field(None, max_length=120)
    phone: Optional[str] = Field(None, max_length=15)
    mobile: Optional[str] = Field(None, max_length=15)
    company: Optional[str] = Field(None, max_length=300)
    position: Optional[str] = Field(None, max_length=150)
    website: Optional[str] = Field(None, max_length=200)
    address: Optional[str] = Field(None, max_length=300)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=10)
    industry_template: Optional[IndustryTemplate] = None
    custom_fields: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True,
        use_enum_values=True
    )


class ContactOut(BaseModel):
    """Schema for reading contact data - API responses"""
    id: UUID
    owner_id: UUID
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str
    zip_code: Optional[str] = None
    industry_template: IndustryTemplate
    custom_fields: Dict[str, Any] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    # Información adicional computada
    display_name: Optional[str] = None
    contact_methods: Optional[List[str]] = None

    model_config = ConfigDict(
        from_attributes=True,
        use_enum_values=True
    )

    @classmethod
    def model_validate(cls, contact, **kwargs) -> 'ContactOut':
        """Construye ContactOut desde el modelo"""

        # Display name es el full_name
        display_name = contact.full_name

        # Métodos de contacto disponibles
        contact_methods = []
        if contact.email:
            contact_methods.append(f"📧 {contact.email}")
        if contact.phone:
            contact_methods.append(f"📞 {contact.phone}")
        if contact.mobile:
            contact_methods.append(f"📱 {contact.mobile}")

        data = {
            "id": contact.id,
            "owner_id": contact.owner_id,
            "full_name": contact.full_name,
            "email": contact.email,
            "phone": contact.phone,
            "mobile": contact.mobile,
            "company": contact.company,
            "position": contact.position,
            "website": contact.website,
            "address": contact.address,
            "city": contact.city,
            "state": contact.state,
            "country": contact.country,
            "zip_code": contact.zip_code,
            "industry_template": contact.industry_template,
            "custom_fields": contact.custom_fields or {},
            "tags": contact.tags or [],
            "notes": contact.notes,
            "is_active": contact.is_active,
            "created_at": contact.created_at,
            "updated_at": contact.updated_at,
            "display_name": display_name,
            "contact_methods": contact_methods
        }

        return cls(**data)


class ContactInDB(ContactOut):
    """Schema for internal use"""
    pass


class ContactListResponse(BaseModel):
    """Schema para respuestas de listados con metadatos"""
    contacts: List[ContactOut]
    total: int
    page: int
    per_page: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)


class ContactStats(BaseModel):
    """Schema para estadísticas de contactos"""
    total_contacts: int
    active_contacts: int
    inactive_contacts: int
    by_industry: Dict[str, int]
    by_country: Dict[str, int]
    recent_contacts: int  # Últimos 7 días

    model_config = ConfigDict(from_attributes=True)


class ContactImportRow(BaseModel):
    """Schema para validar filas de importación CSV"""
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = "Ecuador"
    zip_code: Optional[str] = None
    industry_template: str = "generic"
    tags: Optional[str] = None  # Separados por comas
    notes: Optional[str] = None

    model_config = ConfigDict(str_strip_whitespace=True)


class ContactImportResult(BaseModel):
    """Schema para resultado de importación"""
    success: bool
    total_rows: int
    imported: int
    failed: int
    errors: List[Dict[str, Any]] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ContactExportRequest(BaseModel):
    """Schema para solicitud de exportación"""
    format: str = Field(..., pattern="^(csv|excel)$")
    filters: Optional[Dict[str, Any]] = Field(default_factory=dict)
    fields: Optional[List[str]] = None  # Campos específicos a exportar

    model_config = ConfigDict(str_strip_whitespace=True)


def safe_model_validate(model_class, data):
    """Helper para validar modelos de forma segura"""
    try:
        if hasattr(model_class, 'model_validate'):
            return model_class.model_validate(data)
        else:
            return model_class.from_orm(data)
    except Exception as e:
        if hasattr(data, '__dict__'):
            return model_class(**{k: v for k, v in data.__dict__.items() if not k.startswith('_')})
        else:
            return model_class(**data)


def contact_to_out_schema(contact) -> ContactOut:
    """Convierte modelo Contact a ContactOut de forma robusta"""
    try:
        return ContactOut.model_validate(contact)
    except Exception:
        return ContactOut.from_contact_model(contact)


__all__ = [
    'ContactBase',
    'ContactCreate',
    'ContactUpdate',
    'ContactOut',
    'ContactInDB',
    'ContactListResponse',
    'ContactStats',
    'ContactImportRow',
    'ContactImportResult',
    'ContactExportRequest',
    'IndustryTemplate',
    'safe_model_validate',
    'contact_to_out_schema'
]
