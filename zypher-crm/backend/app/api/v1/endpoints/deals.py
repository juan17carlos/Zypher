from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date

from app.core.database import get_db
from app.core.security import get_current_user_from_token
from app.models.deal import Deal, DealStage

router = APIRouter()


# Schemas
class DealCreate(BaseModel):
    title: str
    description: Optional[str] = None
    value: float = 0.0
    currency: str = "USD"
    stage: DealStage = DealStage.LEAD
    probability: int = 0
    expected_close_date: Optional[date] = None
    contact_id: int
    custom_fields: dict = {}


class DealUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    value: Optional[float] = None
    currency: Optional[str] = None
    stage: Optional[DealStage] = None
    probability: Optional[int] = None
    expected_close_date: Optional[date] = None
    custom_fields: Optional[dict] = None


class DealResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    value: float
    currency: str
    stage: str
    probability: int
    expected_close_date: Optional[date]
    contact_id: int
    owner_id: int
    custom_fields: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[DealResponse])
async def get_deals(
    skip: int = 0,
    limit: int = 100,
    stage: Optional[DealStage] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Obtener lista de deals"""

    user_id = int(current_user["sub"])
    query = db.query(Deal).filter(Deal.owner_id == user_id)

    if stage:
        query = query.filter(Deal.stage == stage)

    deals = query.offset(skip).limit(limit).all()
    return deals


@router.post("/", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_data: DealCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Crear nuevo deal"""

    user_id = int(current_user["sub"])

    new_deal = Deal(
        **deal_data.model_dump(),
        owner_id=user_id
    )

    db.add(new_deal)
    db.commit()
    db.refresh(new_deal)

    return new_deal


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Obtener un deal específico"""

    user_id = int(current_user["sub"])
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.owner_id == user_id
    ).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal no encontrado"
        )

    return deal


@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    deal_data: DealUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Actualizar deal"""

    user_id = int(current_user["sub"])
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.owner_id == user_id
    ).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal no encontrado"
        )

    # Actualizar campos
    update_data = deal_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(deal, key, value)

    db.commit()
    db.refresh(deal)

    return deal


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Eliminar deal"""

    user_id = int(current_user["sub"])
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.owner_id == user_id
    ).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal no encontrado"
        )

    db.delete(deal)
    db.commit()

    return None
