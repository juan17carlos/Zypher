# app/dependencies.py - Dependencies y validaciones para Zypher CRM

from typing import Generator, Optional, Type, TypeVar, Any
from sqlalchemy.orm import Session, Query as SQLQuery
from sqlalchemy import and_, func
from fastapi import Depends, HTTPException, status, Request
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import get_current_user_from_token
from app.models.user import User
import logging

# Importaciones seguras para validaciones
try:
    from app.models.contact import Contact as ContactModel
    CONTACT_MODEL_AVAILABLE = True
except ImportError:
    CONTACT_MODEL_AVAILABLE = False
    logging.warning("Modelo Contact no disponible")

try:
    from app.models.deal import Deal as DealModel
    DEAL_MODEL_AVAILABLE = True
except ImportError:
    DEAL_MODEL_AVAILABLE = False
    logging.warning("Modelo Deal no disponible")

try:
    from app.models.task import Task as TaskModel
    TASK_MODEL_AVAILABLE = True
except ImportError:
    TASK_MODEL_AVAILABLE = False
    logging.warning("Modelo Task no disponible")

try:
    from app.models.note import Note as NoteModel
    NOTE_MODEL_AVAILABLE = True
except ImportError:
    NOTE_MODEL_AVAILABLE = False
    logging.warning("Modelo Note no disponible")


# ==========================================
# DEPENDENCIAS BÁSICAS
# ==========================================

def get_db() -> Generator:
    """Obtiene una sesión de la base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    Obtiene el usuario actual desde el token (cookies o Bearer)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales de autenticación",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Obtener datos del token
    user_data = get_current_user_from_token(request)
    if not user_data:
        raise credentials_exception

    user_id = user_data.get("user_id")
    if not user_id:
        raise credentials_exception

    # Buscar usuario en la base de datos
    user = None

    try:
        # Intentar como UUID primero
        import uuid
        user_uuid = uuid.UUID(user_id)
        user = db.query(User).filter(User.id == user_uuid).first()
    except (ValueError, TypeError):
        raise credentials_exception

    if user is None:
        logging.error(f"Usuario no encontrado para ID: {user_id}")
        raise credentials_exception

    return user


async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Obtiene el usuario actual si está autenticado, sino retorna None
    Útil para endpoints públicos que cambian comportamiento si hay usuario
    """
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Usuario activo con validaciones mínimas"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )

    return current_user


# ==========================================
# QUERIES FILTRADAS POR PROPIETARIO (OWNER)
# ==========================================

def get_user_contacts_query(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> SQLQuery:
    """Query de contactos filtrado por propietario"""
    try:
        if not CONTACT_MODEL_AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Funcionalidad de contactos no disponible"
            )

        query = db.query(ContactModel).filter(
            ContactModel.owner_id == current_user.id
        )

        return query

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error en get_user_contacts_query: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


def get_user_deals_query(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> SQLQuery:
    """Query de deals/oportunidades filtrado por propietario"""
    try:
        if not DEAL_MODEL_AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Funcionalidad de deals no disponible"
            )

        query = db.query(DealModel).filter(
            DealModel.owner_id == current_user.id
        )

        return query

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error en get_user_deals_query: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo deals"
        )


def get_user_tasks_query(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> SQLQuery:
    """Query de tareas filtrado por propietario"""
    try:
        if not TASK_MODEL_AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Funcionalidad de tareas no disponible"
            )

        query = db.query(TaskModel).filter(
            TaskModel.owner_id == current_user.id
        )

        return query

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error en get_user_tasks_query: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo tareas"
        )


def get_user_notes_query(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> SQLQuery:
    """Query de notas filtrado por propietario"""
    try:
        if not NOTE_MODEL_AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Funcionalidad de notas no disponible"
            )

        query = db.query(NoteModel).filter(
            NoteModel.owner_id == current_user.id
        )

        return query

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error en get_user_notes_query: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error obteniendo notas"
        )


# ==========================================
# HELPERS PARA VERIFICAR OWNERSHIP
# ==========================================

def verify_resource_ownership(
    resource: Any,
    current_user: User,
    resource_name: str = "recurso"
) -> None:
    """Verificar ownership de recurso por usuario"""
    if not hasattr(resource, 'owner_id'):
        return

    try:
        if str(resource.owner_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El {resource_name} no existe o no tienes acceso a él"
            )
    except Exception as e:
        logging.error(f"Error verificando ownership de {resource_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error verificando permisos"
        )


def verify_unique_for_user(
    db: Session,
    model_class: Type,
    field_name: str,
    field_value: Any,
    owner_id: str,
    exclude_id: Optional[Any] = None,
    error_message: Optional[str] = None
) -> None:
    """Verificar unicidad para un usuario específico"""
    try:
        query = db.query(model_class).filter(
            getattr(model_class, field_name) == field_value,
            model_class.owner_id == owner_id
        )

        if exclude_id:
            query = query.filter(model_class.id != exclude_id)

        existing = query.first()
        if existing:
            message = error_message or f"Ya existe un registro con {field_name} = {field_value}"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error verificando unicidad: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error verificando datos únicos"
        )


def filter_by_user_ownership(
    query: SQLQuery,
    model_class: Type,
    current_user: User = Depends(get_current_active_user)
) -> SQLQuery:
    """Helper para filtrar por ownership del usuario"""
    if not hasattr(model_class, 'owner_id'):
        logging.warning(f"Modelo {model_class.__name__} no tiene campo owner_id")
        return query

    return query.filter(model_class.owner_id == current_user.id)


def get_user_filtered_query(db: Session, model_class: Type, current_user: User) -> SQLQuery:
    """Helper para obtener query filtrado por usuario"""
    query = db.query(model_class)
    return query.filter(model_class.owner_id == current_user.id)


# ==========================================
# VALIDACIONES DE CONTACTOS
# ==========================================

def validate_can_manage_contacts(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validar que el usuario puede gestionar contactos"""
    # En CRM simple, todos los usuarios activos pueden gestionar sus propios contactos
    return current_user


def validate_can_manage_deals(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validar que el usuario puede gestionar deals"""
    # En CRM simple, todos los usuarios activos pueden gestionar sus propios deals
    return current_user


def validate_can_manage_tasks(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validar que el usuario puede gestionar tareas"""
    # En CRM simple, todos los usuarios activos pueden gestionar sus propias tareas
    return current_user


def validate_can_manage_notes(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validar que el usuario puede gestionar notas"""
    # En CRM simple, todos los usuarios activos pueden gestionar sus propias notas
    return current_user


# ==========================================
# ALIASES PARA COMPATIBILIDAD
# ==========================================

validate_can_view_contacts = validate_can_manage_contacts
validate_can_view_deals = validate_can_manage_deals
validate_can_view_tasks = validate_can_manage_tasks
validate_can_view_notes = validate_can_manage_notes
validate_can_export_data = get_current_active_user


__all__ = [
    'get_db',
    'get_current_user',
    'get_current_user_optional',
    'get_current_active_user',
    'get_user_contacts_query',
    'get_user_deals_query',
    'get_user_tasks_query',
    'get_user_notes_query',
    'verify_resource_ownership',
    'verify_unique_for_user',
    'filter_by_user_ownership',
    'get_user_filtered_query',
    'validate_can_manage_contacts',
    'validate_can_manage_deals',
    'validate_can_manage_tasks',
    'validate_can_manage_notes',
]
