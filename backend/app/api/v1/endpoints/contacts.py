from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user_from_token
from app.models.contact import Contact, IndustryTemplate

router = APIRouter()


# Schemas
class ContactCreate(BaseModel):
    full_name: str
    email: EmailStr | None = None
    phone: str | None = None
    company: str | None = None
    position: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    zip_code: str | None = None
    industry_template: IndustryTemplate = IndustryTemplate.GENERIC
    custom_fields: dict = {}
    tags: list = []


class ContactUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    company: str | None = None
    position: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    zip_code: str | None = None
    industry_template: IndustryTemplate | None = None
    custom_fields: dict | None = None
    tags: list | None = None


class ContactResponse(BaseModel):
    id: int
    full_name: str
    email: str | None
    phone: str | None
    company: str | None
    position: str | None
    industry_template: str
    custom_fields: dict
    tags: list
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Obtener lista de contactos"""

    user_id = int(current_user["sub"])
    contacts = db.query(Contact).filter(
        Contact.owner_id == user_id
    ).offset(skip).limit(limit).all()

    return contacts


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact_data: ContactCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Crear nuevo contacto"""

    user_id = int(current_user["sub"])

    new_contact = Contact(
        **contact_data.model_dump(),
        owner_id=user_id
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Obtener un contacto específico"""

    user_id = int(current_user["sub"])
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == user_id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )

    return contact


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    contact_data: ContactUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Actualizar contacto"""

    user_id = int(current_user["sub"])
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == user_id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )

    # Actualizar campos
    update_data = contact_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(contact, key, value)

    db.commit()
    db.refresh(contact)

    return contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Eliminar contacto"""

    user_id = int(current_user["sub"])
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.owner_id == user_id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado"
        )

    db.delete(contact)
    db.commit()

    return None
