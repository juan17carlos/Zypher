# backend/app/api/v1/endpoints/tasks.py - Endpoints completos para Tasks

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_
from typing import Optional
from datetime import datetime, timedelta

from app.dependencies import get_db, get_current_user
from app.models.task import Task, TaskStatus, TaskPriority
from app.models.contact import Contact
from app.models.deal import Deal
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskOut,
    TasksPaginatedResponse,
    TaskStats,
    TaskWithDetails,
)

router = APIRouter()


# ==========================================
# ENDPOINT CRUD COMPLETOS
# ==========================================

@router.get("/", response_model=TasksPaginatedResponse)
async def get_tasks_paginated(
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(20, ge=1, le=100, description="Tamaño de página"),
    search: Optional[str] = Query(None, description="Búsqueda por título o descripción"),
    status: Optional[TaskStatus] = Query(None, description="Filtrar por estado"),
    priority: Optional[TaskPriority] = Query(None, description="Filtrar por prioridad"),
    contact_id: Optional[int] = Query(None, description="Filtrar por contacto"),
    deal_id: Optional[int] = Query(None, description="Filtrar por deal"),
    overdue: Optional[bool] = Query(None, description="Solo tareas vencidas"),
    sort_by: str = Query("due_date", description="Campo para ordenar"),
    sort_order: str = Query("asc", description="Orden: asc o desc"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener tasks paginadas con filtros y búsqueda"""

    user_id = int(current_user["sub"])

    # Query base
    query = db.query(Task).filter(Task.assigned_to_id == user_id)

    # Filtro de búsqueda
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_filter),
                Task.description.ilike(search_filter),
            )
        )

    # Filtros específicos
    if status:
        query = query.filter(Task.status == status)

    if priority:
        query = query.filter(Task.priority == priority)

    if contact_id:
        query = query.filter(Task.contact_id == contact_id)

    if deal_id:
        query = query.filter(Task.deal_id == deal_id)

    # Filtro de vencidas
    if overdue is True:
        now = datetime.utcnow()
        query = query.filter(
            and_(
                Task.due_date < now,
                Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
            )
        )

    # Total de registros
    total = query.count()

    # Ordenamiento
    order_column = getattr(Task, sort_by, Task.due_date)
    if sort_order == "desc":
        query = query.order_by(order_column.desc())
    else:
        query = query.order_by(order_column.asc())

    # Paginación
    offset = (page - 1) * page_size
    tasks = query.offset(offset).limit(page_size).all()

    total_pages = (total + page_size - 1) // page_size

    return TasksPaginatedResponse(
        items=tasks,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/stats", response_model=TaskStats)
async def get_tasks_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener estadísticas de tasks"""

    user_id = int(current_user["sub"])

    # Query base
    query = db.query(Task).filter(Task.assigned_to_id == user_id)

    # Totales por estado
    total_tasks = query.count()
    pending_tasks = query.filter(Task.status == TaskStatus.PENDING).count()
    in_progress_tasks = query.filter(Task.status == TaskStatus.IN_PROGRESS).count()
    completed_tasks = query.filter(Task.status == TaskStatus.COMPLETED).count()
    cancelled_tasks = query.filter(Task.status == TaskStatus.CANCELLED).count()

    # Por prioridad
    tasks_by_priority = {}
    for priority in TaskPriority:
        tasks_by_priority[priority.value] = query.filter(
            Task.priority == priority
        ).count()

    # Por estado
    tasks_by_status = {}
    for task_status in TaskStatus:
        tasks_by_status[task_status.value] = query.filter(
            Task.status == task_status
        ).count()

    # Vencimiento
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    week_end = today_start + timedelta(days=7)

    overdue_tasks = query.filter(
        and_(
            Task.due_date < now,
            Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
        )
    ).count()

    due_today = query.filter(
        and_(
            Task.due_date >= today_start,
            Task.due_date < today_end,
            Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
        )
    ).count()

    due_this_week = query.filter(
        and_(
            Task.due_date >= today_start,
            Task.due_date < week_end,
            Task.status.in_([TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
        )
    ).count()

    # Tasa de completación
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0.0

    return TaskStats(
        total_tasks=total_tasks,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
        completed_tasks=completed_tasks,
        cancelled_tasks=cancelled_tasks,
        tasks_by_priority=tasks_by_priority,
        tasks_by_status=tasks_by_status,
        overdue_tasks=overdue_tasks,
        due_today=due_today,
        due_this_week=due_this_week,
        completion_rate=completion_rate,
    )


@router.get("/{task_id}", response_model=TaskWithDetails)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener una task específica con detalles"""

    user_id = int(current_user["sub"])

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.assigned_to_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task no encontrada"
        )

    # Obtener información adicional
    contact_name = None
    deal_title = None
    assigned_to_name = None

    if task.contact_id:
        contact = db.query(Contact).filter(Contact.id == task.contact_id).first()
        if contact:
            contact_name = contact.full_name

    if task.deal_id:
        deal = db.query(Deal).filter(Deal.id == task.deal_id).first()
        if deal:
            deal_title = deal.title

    user = db.query(User).filter(User.id == task.assigned_to_id).first()
    if user:
        assigned_to_name = user.full_name

    # Crear respuesta con detalles
    task_dict = {
        **task.__dict__,
        "contact_name": contact_name,
        "deal_title": deal_title,
        "assigned_to_name": assigned_to_name,
    }

    return task_dict


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Crear nueva task"""

    user_id = int(current_user["sub"])

    # Verificar que el contacto existe si se proporciona
    if task_data.contact_id:
        contact = db.query(Contact).filter(
            Contact.id == task_data.contact_id,
            Contact.owner_id == user_id
        ).first()
        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contacto no encontrado"
            )

    # Verificar que el deal existe si se proporciona
    if task_data.deal_id:
        deal = db.query(Deal).filter(
            Deal.id == task_data.deal_id,
            Deal.owner_id == user_id
        ).first()
        if not deal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Deal no encontrado"
            )

    # Crear la task
    new_task = Task(**task_data.model_dump(), assigned_to_id=user_id)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.put("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Actualizar task"""

    user_id = int(current_user["sub"])

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.assigned_to_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task no encontrada"
        )

    # Actualizar campos
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    # Si se marca como COMPLETED, registrar fecha de completado
    if task_data.status == TaskStatus.COMPLETED and not task.completed_at:
        task.completed_at = datetime.utcnow()

    # Si se cambia de COMPLETED a otro estado, limpiar fecha de completado
    if task_data.status and task_data.status != TaskStatus.COMPLETED:
        task.completed_at = None

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Eliminar task"""

    user_id = int(current_user["sub"])

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.assigned_to_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task no encontrada"
        )

    db.delete(task)
    db.commit()

    return None
