# backend/app/api/v1/endpoints/contacts.py - Endpoints completos para Contactos

from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlalchemy.orm import Session, Query as SQLQuery
from sqlalchemy import func, asc, desc, or_, and_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import csv
import io
from uuid import UUID

# Imports actualizados
from app.dependencies import (
    get_db,
    get_current_active_user,
    get_user_contacts_query,
    validate_can_manage_contacts,
    verify_resource_ownership,
    verify_unique_for_user
)
from app.models.user import User
from app.models.contact import Contact as ContactModel, IndustryTemplate
from app.schemas.contact import (
    ContactCreate,
    ContactUpdate,
    ContactOut,
    ContactStats,
    ContactImportRow,
    ContactImportResult,
    ContactExportRequest
)
from app.schemas.pagination import ContactsPaginatedResponse

router = APIRouter()
logger = logging.getLogger(__name__)


# ==========================================
# ENDPOINT CRUD COMPLETOS
# ==========================================

@router.get("/", response_model=ContactsPaginatedResponse)
def list_contacts(
    *,
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(50, ge=1, le=100, description="Número de registros a retornar"),
    search: Optional[str] = Query(None, description="Búsqueda por nombre, email, empresa, teléfono"),
    industry: Optional[IndustryTemplate] = Query(None, description="Filtrar por industria"),
    country: Optional[str] = Query(None, description="Filtrar por país"),
    is_active: Optional[bool] = Query(None, description="Filtrar por estado activo/inactivo"),
    tags: Optional[str] = Query(None, description="Filtrar por tags (separados por coma)"),
    sort_by: Optional[str] = Query("created_at", description="Campo para ordenar"),
    sort_order: Optional[str] = Query("desc", description="Orden: asc o desc"),
    contacts_query: SQLQuery = Depends(get_user_contacts_query),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    LISTAR CONTACTOS DEL USUARIO CON PAGINACIÓN Y FILTROS
    - Filtrado automático por owner_id
    - Búsqueda en múltiples campos
    - Filtros por industria, país, estado
    - Ordenamiento configurable
    - Estadísticas globales
    """

    try:
        # Query base ya filtrada por owner_id
        query = contacts_query

        # Aplicar filtro de búsqueda
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    ContactModel.full_name.ilike(search_term),
                    ContactModel.email.ilike(search_term),
                    ContactModel.company.ilike(search_term),
                    ContactModel.phone.ilike(search_term),
                    ContactModel.mobile.ilike(search_term),
                    ContactModel.city.ilike(search_term)
                )
            )

        # Filtro por industria
        if industry:
            query = query.filter(ContactModel.industry_template == industry)

        # Filtro por país
        if country:
            query = query.filter(ContactModel.country.ilike(f"%{country}%"))

        # Filtro por estado activo
        if is_active is not None:
            query = query.filter(ContactModel.is_active == is_active)

        # Filtro por tags (JSON array contains)
        if tags:
            tags_list = [tag.strip() for tag in tags.split(",")]
            for tag in tags_list:
                query = query.filter(ContactModel.tags.contains([tag]))

        # Ordenamiento
        order_column = getattr(ContactModel, sort_by, ContactModel.created_at)
        if sort_order == "asc":
            query = query.order_by(asc(order_column))
        else:
            query = query.order_by(desc(order_column))

        # Obtener total antes de la paginación
        total = query.count()

        # Aplicar paginación
        contacts = query.offset(skip).limit(limit).all()

        # Calcular estadísticas globales
        stats_query = contacts_query
        total_contacts = stats_query.count()
        active_contacts = stats_query.filter(ContactModel.is_active == True).count()
        inactive_contacts = stats_query.filter(ContactModel.is_active == False).count()

        # Contactos recientes (últimos 7 días)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_contacts = stats_query.filter(ContactModel.created_at >= seven_days_ago).count()

        # Distribución por industria
        industry_distribution = db.query(
            ContactModel.industry_template,
            func.count(ContactModel.id)
        ).filter(
            ContactModel.owner_id == current_user.id
        ).group_by(ContactModel.industry_template).all()

        by_industry = {str(ind.value): count for ind, count in industry_distribution}

        # Distribución por país
        country_distribution = db.query(
            ContactModel.country,
            func.count(ContactModel.id)
        ).filter(
            ContactModel.owner_id == current_user.id
        ).group_by(ContactModel.country).all()

        by_country = {country or "Sin país": count for country, count in country_distribution}

        # Construir estadísticas
        global_stats = {
            "total": total_contacts,
            "active": active_contacts,
            "inactive": inactive_contacts,
            "by_industry": by_industry,
            "by_country": by_country,
            "recent": recent_contacts
        }

        # Calcular páginas
        pages = (total + limit - 1) // limit if limit > 0 else 1
        current_page = (skip // limit) + 1 if limit > 0 else 1

        # Convertir a schemas de salida
        contact_outs = [ContactOut.model_validate(contact) for contact in contacts]

        logger.info(f"Listado de contactos para usuario {current_user.email}: {total} total, página {current_page}")

        return {
            "items": contact_outs,
            "total": total,
            "page": current_page,
            "size": limit,
            "pages": pages,
            "has_more": total > (skip + limit),
            "global_stats": global_stats
        }

    except Exception as e:
        logger.error(f"Error listando contactos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo contactos: {str(e)}"
        )


@router.post("/", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(
    *,
    contact_in: ContactCreate,
    current_user: User = Depends(validate_can_manage_contacts),
    db: Session = Depends(get_db)
):
    """
    CREAR NUEVO CONTACTO
    - Validación automática de campos
    - Asignación automática de owner_id
    - Validación de unicidad por email si existe
    """

    try:
        # Verificar unicidad de email si se proporciona
        if contact_in.email:
            verify_unique_for_user(
                db=db,
                model_class=ContactModel,
                field_name="email",
                field_value=contact_in.email,
                owner_id=str(current_user.id),
                error_message=f"Ya existe un contacto con el email {contact_in.email}"
            )

        # Crear contacto
        contact_data = contact_in.model_dump()
        new_contact = ContactModel(
            **contact_data,
            owner_id=current_user.id
        )

        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)

        logger.info(f"Contacto creado: {new_contact.full_name} por usuario {current_user.email}")

        return ContactOut.model_validate(new_contact)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creando contacto: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creando contacto: {str(e)}"
        )


@router.get("/{contact_id}", response_model=ContactOut)
def get_contact(
    *,
    contact_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    OBTENER CONTACTO POR ID
    - Validación automática de ownership
    """

    try:
        contact = db.query(ContactModel).filter(
            ContactModel.id == contact_id,
            ContactModel.owner_id == current_user.id
        ).first()

        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contacto no encontrado"
            )

        logger.info(f"Contacto obtenido: {contact.full_name} por usuario {current_user.email}")

        return ContactOut.model_validate(contact)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo contacto: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo contacto: {str(e)}"
        )


@router.put("/{contact_id}", response_model=ContactOut)
def update_contact(
    *,
    contact_id: UUID,
    contact_in: ContactUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    ACTUALIZAR CONTACTO
    - Validación automática de ownership
    - Solo actualiza campos proporcionados
    """

    try:
        contact = db.query(ContactModel).filter(
            ContactModel.id == contact_id,
            ContactModel.owner_id == current_user.id
        ).first()

        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contacto no encontrado"
            )

        # Verificar unicidad de email si se actualiza
        if contact_in.email and contact_in.email != contact.email:
            verify_unique_for_user(
                db=db,
                model_class=ContactModel,
                field_name="email",
                field_value=contact_in.email,
                owner_id=str(current_user.id),
                exclude_id=contact_id,
                error_message=f"Ya existe un contacto con el email {contact_in.email}"
            )

        # Actualizar campos
        update_data = contact_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(contact, field, value)

        db.commit()
        db.refresh(contact)

        logger.info(f"Contacto actualizado: {contact.full_name} por usuario {current_user.email}")

        return ContactOut.model_validate(contact)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error actualizando contacto: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error actualizando contacto: {str(e)}"
        )


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    *,
    contact_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    ELIMINAR CONTACTO
    - Validación automática de ownership
    - Eliminación permanente (no soft delete)
    """

    try:
        contact = db.query(ContactModel).filter(
            ContactModel.id == contact_id,
            ContactModel.owner_id == current_user.id
        ).first()

        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contacto no encontrado"
            )

        contact_name = contact.full_name

        db.delete(contact)
        db.commit()

        logger.info(f"Contacto eliminado: {contact_name} por usuario {current_user.email}")

        return None

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error eliminando contacto: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error eliminando contacto: {str(e)}"
        )


# ==========================================
# ENDPOINTS DE ESTADÍSTICAS
# ==========================================

@router.get("/stats/overview", response_model=ContactStats)
def get_contacts_stats(
    *,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    OBTENER ESTADÍSTICAS DE CONTACTOS
    - Total, activos, inactivos
    - Distribución por industria
    - Distribución por país
    - Contactos recientes
    """

    try:
        # Query base
        query = db.query(ContactModel).filter(ContactModel.owner_id == current_user.id)

        # Totales
        total_contacts = query.count()
        active_contacts = query.filter(ContactModel.is_active == True).count()
        inactive_contacts = query.filter(ContactModel.is_active == False).count()

        # Contactos recientes (últimos 7 días)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_contacts = query.filter(ContactModel.created_at >= seven_days_ago).count()

        # Distribución por industria
        industry_distribution = db.query(
            ContactModel.industry_template,
            func.count(ContactModel.id)
        ).filter(
            ContactModel.owner_id == current_user.id
        ).group_by(ContactModel.industry_template).all()

        by_industry = {str(ind.value): count for ind, count in industry_distribution}

        # Distribución por país
        country_distribution = db.query(
            ContactModel.country,
            func.count(ContactModel.id)
        ).filter(
            ContactModel.owner_id == current_user.id
        ).group_by(ContactModel.country).all()

        by_country = {country or "Sin país": count for country, count in country_distribution}

        logger.info(f"Estadísticas de contactos obtenidas para usuario {current_user.email}")

        return {
            "total_contacts": total_contacts,
            "active_contacts": active_contacts,
            "inactive_contacts": inactive_contacts,
            "by_industry": by_industry,
            "by_country": by_country,
            "recent_contacts": recent_contacts
        }

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo estadísticas: {str(e)}"
        )


# ==========================================
# ENDPOINTS DE EXPORTACIÓN
# ==========================================

@router.get("/export/csv")
def export_contacts_csv(
    *,
    industry: Optional[IndustryTemplate] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    EXPORTAR CONTACTOS A CSV
    - Filtros opcionales
    - Formato compatible con Excel
    """

    try:
        # Query base
        query = db.query(ContactModel).filter(ContactModel.owner_id == current_user.id)

        # Aplicar filtros
        if industry:
            query = query.filter(ContactModel.industry_template == industry)
        if country:
            query = query.filter(ContactModel.country.ilike(f"%{country}%"))
        if is_active is not None:
            query = query.filter(ContactModel.is_active == is_active)

        contacts = query.all()

        # Crear CSV en memoria
        output = io.StringIO()
        writer = csv.writer(output)

        # Encabezados
        writer.writerow([
            'Nombre Completo', 'Email', 'Teléfono', 'Móvil', 'Empresa', 'Cargo',
            'Sitio Web', 'Dirección', 'Ciudad', 'Estado/Provincia', 'País',
            'Código Postal', 'Industria', 'Tags', 'Notas', 'Estado', 'Fecha Creación'
        ])

        # Datos
        for contact in contacts:
            writer.writerow([
                contact.full_name,
                contact.email or '',
                contact.phone or '',
                contact.mobile or '',
                contact.company or '',
                contact.position or '',
                contact.website or '',
                contact.address or '',
                contact.city or '',
                contact.state or '',
                contact.country,
                contact.zip_code or '',
                contact.industry_template.value,
                ','.join(contact.tags or []),
                contact.notes or '',
                'Activo' if contact.is_active else 'Inactivo',
                contact.created_at.strftime('%Y-%m-%d %H:%M:%S') if contact.created_at else ''
            ])

        # Preparar respuesta
        output.seek(0)

        logger.info(f"Exportación CSV de {len(contacts)} contactos para usuario {current_user.email}")

        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=contactos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            }
        )

    except Exception as e:
        logger.error(f"Error exportando contactos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exportando contactos: {str(e)}"
        )


# ==========================================
# ENDPOINTS DE IMPORTACIÓN
# ==========================================

@router.post("/import/csv", response_model=ContactImportResult)
def import_contacts_csv(
    *,
    file_content: str,
    current_user: User = Depends(validate_can_manage_contacts),
    db: Session = Depends(get_db)
):
    """
    IMPORTAR CONTACTOS DESDE CSV
    - Validación de cada fila
    - Reporte de errores detallado
    - Creación en lote
    """

    try:
        # Parsear CSV
        csv_reader = csv.DictReader(io.StringIO(file_content))

        imported = 0
        failed = 0
        errors = []

        for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 (header is row 1)
            try:
                # Mapear campos
                contact_data = {
                    "full_name": row.get("Nombre Completo", "").strip(),
                    "email": row.get("Email", "").strip() or None,
                    "phone": row.get("Teléfono", "").strip() or None,
                    "mobile": row.get("Móvil", "").strip() or None,
                    "company": row.get("Empresa", "").strip() or None,
                    "position": row.get("Cargo", "").strip() or None,
                    "website": row.get("Sitio Web", "").strip() or None,
                    "address": row.get("Dirección", "").strip() or None,
                    "city": row.get("Ciudad", "").strip() or None,
                    "state": row.get("Estado/Provincia", "").strip() or None,
                    "country": row.get("País", "Ecuador").strip(),
                    "zip_code": row.get("Código Postal", "").strip() or None,
                    "industry_template": row.get("Industria", "generic").strip(),
                    "tags": [tag.strip() for tag in row.get("Tags", "").split(",") if tag.strip()],
                    "notes": row.get("Notas", "").strip() or None
                }

                # Validar con Pydantic
                validated_contact = ContactCreate(**contact_data)

                # Verificar unicidad de email
                if validated_contact.email:
                    existing = db.query(ContactModel).filter(
                        ContactModel.email == validated_contact.email,
                        ContactModel.owner_id == current_user.id
                    ).first()

                    if existing:
                        errors.append({
                            "row": row_num,
                            "email": validated_contact.email,
                            "error": "Email duplicado"
                        })
                        failed += 1
                        continue

                # Crear contacto
                new_contact = ContactModel(
                    **validated_contact.model_dump(),
                    owner_id=current_user.id
                )

                db.add(new_contact)
                imported += 1

            except Exception as e:
                errors.append({
                    "row": row_num,
                    "error": str(e)
                })
                failed += 1

        # Commit si hubo importaciones exitosas
        if imported > 0:
            db.commit()

        logger.info(f"Importación CSV: {imported} exitosos, {failed} fallidos para usuario {current_user.email}")

        return {
            "success": imported > 0,
            "total_rows": imported + failed,
            "imported": imported,
            "failed": failed,
            "errors": errors,
            "warnings": []
        }

    except Exception as e:
        logger.error(f"Error importando contactos: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error importando contactos: {str(e)}"
        )
