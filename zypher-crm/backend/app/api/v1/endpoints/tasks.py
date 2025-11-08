from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user_from_token
from app.models.task import Task, TaskStatus, TaskPriority

router = APIRouter()


# Schemas
class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: datetime | None = None
    contact_id: int | None = None
    deal_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: datetime | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    due_date: datetime | None
    completed_at: datetime | None
    assigned_to_id: int
    contact_id: int | None
    deal_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    status_filter: TaskStatus | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Obtener lista de tareas"""

    user_id = int(current_user["sub"])
    query = db.query(Task).filter(Task.assigned_to_id == user_id)

    if status_filter:
        query = query.filter(Task.status == status_filter)

    tasks = query.offset(skip).limit(limit).all()
    return tasks


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Crear nueva tarea"""

    user_id = int(current_user["sub"])

    new_task = Task(
        **task_data.model_dump(),
        assigned_to_id=user_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Actualizar tarea"""

    user_id = int(current_user["sub"])
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.assigned_to_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada"
        )

    # Actualizar campos
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    # Si se marca como completada, guardar fecha
    if update_data.get("status") == TaskStatus.COMPLETED and not task.completed_at:
        task.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_from_token)
):
    """Eliminar tarea"""

    user_id = int(current_user["sub"])
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.assigned_to_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada"
        )

    db.delete(task)
    db.commit()

    return None
