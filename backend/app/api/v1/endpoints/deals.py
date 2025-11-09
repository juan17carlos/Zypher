# backend/app/api/v1/endpoints/deals.py - Endpoints completos para Deals (Phase 3)

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, case
from typing import Optional
from datetime import datetime, timedelta

from app.dependencies import get_db, get_current_user
from app.models.deal import Deal, DealStage, DealPriority, DealSource
from app.models.contact import Contact
from app.schemas.deal import (
    DealCreate,
    DealUpdate,
    DealOut,
    DealsPaginatedResponse,
    DealStats,
    DealStageUpdate,
    DealWithContact,
)

router = APIRouter()


@router.get("/", response_model=DealsPaginatedResponse)
async def get_deals_paginated(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(20, ge=1, le=100, description="Tamaño de página"),
    search: Optional[str] = Query(None, description="Búsqueda por título o descripción"),
    stage: Optional[DealStage] = Query(None, description="Filtrar por etapa"),
    priority: Optional[DealPriority] = Query(None, description="Filtrar por prioridad"),
    source: Optional[DealSource] = Query(None, description="Filtrar por fuente"),
    min_value: Optional[float] = Query(None, description="Valor mínimo"),
    max_value: Optional[float] = Query(None, description="Valor máximo"),
    is_active: Optional[bool] = Query(None, description="Filtrar por estado"),
    sort_by: str = Query("created_at", description="Campo para ordenar"),
    sort_order: str = Query("desc", description="Orden: asc o desc"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener deals paginados con filtros y búsqueda"""

    user_id = current_user.id

    # Query base
    query = db.query(Deal).filter(Deal.owner_id == user_id)

    # Filtro de búsqueda
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Deal.title.ilike(search_filter),
                Deal.description.ilike(search_filter),
            )
        )

    # Filtros específicos
    if stage:
        query = query.filter(Deal.stage == stage)

    if priority:
        query = query.filter(Deal.priority == priority)

    if source:
        query = query.filter(Deal.source == source)

    if min_value is not None:
        query = query.filter(Deal.value >= min_value)

    if max_value is not None:
        query = query.filter(Deal.value <= max_value)

    if is_active is not None:
        query = query.filter(Deal.is_active == is_active)

    # Total de registros
    total = query.count()

    # Ordenamiento
    order_column = getattr(Deal, sort_by, Deal.created_at)
    if sort_order == "desc":
        query = query.order_by(order_column.desc())
    else:
        query = query.order_by(order_column.asc())

    # Paginación
    offset = (page - 1) * page_size
    deals = query.offset(offset).limit(page_size).all()

    total_pages = (total + page_size - 1) // page_size

    return DealsPaginatedResponse(
        items=deals,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/stats", response_model=DealStats)
async def get_deals_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener estadísticas del pipeline de ventas"""

    user_id = current_user.id

    # Query base
    query = db.query(Deal).filter(Deal.owner_id == user_id)

    # Totales
    total_deals = query.count()
    active_deals = query.filter(Deal.is_active == True).count()
    won_deals = query.filter(Deal.stage == DealStage.WON).count()
    lost_deals = query.filter(Deal.stage == DealStage.LOST).count()

    # Valor total
    total_value = query.with_entities(func.sum(Deal.value)).scalar() or 0.0
    won_value = (
        query.filter(Deal.stage == DealStage.WON)
        .with_entities(func.sum(Deal.value))
        .scalar()
        or 0.0
    )
    potential_value = (
        query.filter(Deal.stage.in_([DealStage.LEAD, DealStage.CONTACTED, DealStage.QUALIFIED, DealStage.PROPOSAL, DealStage.NEGOTIATION]))
        .with_entities(func.sum(Deal.value))
        .scalar()
        or 0.0
    )

    # Promedio
    average_deal_value = total_value / total_deals if total_deals > 0 else 0.0
    average_win_probability = (
        query.filter(Deal.is_active == True)
        .with_entities(func.avg(Deal.probability))
        .scalar()
        or 0.0
    )

    # Por etapa
    deals_by_stage = {}
    value_by_stage = {}
    for stage in DealStage:
        stage_query = query.filter(Deal.stage == stage)
        deals_by_stage[stage.value] = stage_query.count()
        value_by_stage[stage.value] = (
            stage_query.with_entities(func.sum(Deal.value)).scalar() or 0.0
        )

    # Por prioridad
    deals_by_priority = {}
    for priority in DealPriority:
        deals_by_priority[priority.value] = query.filter(
            Deal.priority == priority
        ).count()

    # Por fuente
    deals_by_source = {}
    for source in DealSource:
        deals_by_source[source.value] = query.filter(Deal.source == source).count()

    # Conversión
    closed_deals = won_deals + lost_deals
    win_rate = (won_deals / closed_deals * 100) if closed_deals > 0 else 0.0

    # Tasa de conversión de leads a won
    total_leads = query.filter(Deal.stage == DealStage.LEAD).count()
    conversion_rate = (won_deals / (total_leads + won_deals) * 100) if (total_leads + won_deals) > 0 else 0.0

    return DealStats(
        total_deals=total_deals,
        active_deals=active_deals,
        won_deals=won_deals,
        lost_deals=lost_deals,
        total_value=total_value,
        won_value=won_value,
        potential_value=potential_value,
        average_deal_value=average_deal_value,
        average_win_probability=average_win_probability,
        deals_by_stage=deals_by_stage,
        value_by_stage=value_by_stage,
        deals_by_priority=deals_by_priority,
        deals_by_source=deals_by_source,
        win_rate=win_rate,
        conversion_rate=conversion_rate,
    )


@router.get("/{deal_id}", response_model=DealWithContact)
async def get_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener un deal específico con información del contacto"""

    user_id = current_user.id

    # Obtener deal con join al contacto
    deal = (
        db.query(Deal)
        .join(Contact, Deal.contact_id == Contact.id)
        .filter(Deal.id == deal_id, Deal.owner_id == user_id)
        .first()
    )

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal no encontrado"
        )

    # Obtener información del contacto
    contact = db.query(Contact).filter(Contact.id == deal.contact_id).first()

    # Crear respuesta con información del contacto
    deal_dict = {
        **deal.__dict__,
        "contact_name": contact.full_name if contact else None,
        "contact_email": contact.email if contact else None,
        "contact_company": contact.company if contact else None,
    }

    return deal_dict


@router.post("/", response_model=DealOut, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_data: DealCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crear nuevo deal"""

    user_id = current_user.id

    # Verificar que el contacto existe y pertenece al usuario
    contact = (
        db.query(Contact)
        .filter(Contact.id == deal_data.contact_id, Contact.owner_id == user_id)
        .first()
    )

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contacto no encontrado o no tienes permiso para acceder"
        )

    # Crear el deal
    new_deal = Deal(**deal_data.model_dump(), owner_id=user_id)

    db.add(new_deal)
    db.commit()
    db.refresh(new_deal)

    return new_deal


@router.put("/{deal_id}", response_model=DealOut)
async def update_deal(
    deal_id: int,
    deal_data: DealUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Actualizar deal"""

    user_id = current_user.id

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

    # Si se marca como WON, registrar fecha de cierre
    if deal_data.stage == DealStage.WON and not deal.actual_close_date:
        deal.actual_close_date = datetime.now().date()
        deal.probability = 100

    # Si se marca como LOST, asegurar que hay motivo
    if deal_data.stage == DealStage.LOST:
        deal.actual_close_date = datetime.now().date()
        deal.probability = 0

    db.commit()
    db.refresh(deal)

    return deal


@router.patch("/{deal_id}/stage", response_model=DealOut)
async def update_deal_stage(
    deal_id: int,
    stage_data: DealStageUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Actualizar la etapa del deal en el pipeline"""

    user_id = current_user.id

    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.owner_id == user_id
    ).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal no encontrado"
        )

    # Actualizar etapa
    deal.stage = stage_data.stage

    # Actualizar probabilidad si se proporciona
    if stage_data.probability is not None:
        deal.probability = stage_data.probability

    # Si se marca como WON
    if stage_data.stage == DealStage.WON:
        deal.actual_close_date = datetime.now().date()
        deal.probability = 100

    # Si se marca como LOST
    if stage_data.stage == DealStage.LOST:
        deal.actual_close_date = datetime.now().date()
        deal.probability = 0
        if stage_data.lost_reason:
            deal.lost_reason = stage_data.lost_reason

    db.commit()
    db.refresh(deal)

    return deal


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(
    deal_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Eliminar deal"""

    user_id = current_user.id

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


@router.get("/pipeline/summary")
async def get_pipeline_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener resumen del pipeline por etapas (para vista Kanban)"""

    user_id = current_user.id

    # Obtener todos los deals agrupados por etapa
    pipeline_summary = {}

    for stage in DealStage:
        deals = (
            db.query(Deal)
            .filter(Deal.owner_id == user_id, Deal.stage == stage, Deal.is_active == True)
            .order_by(Deal.created_at.desc())
            .all()
        )

        total_value = sum(deal.value for deal in deals)

        pipeline_summary[stage.value] = {
            "stage": stage.value,
            "count": len(deals),
            "total_value": total_value,
            "deals": [DealOut.model_validate(deal) for deal in deals],
        }

    return pipeline_summary
