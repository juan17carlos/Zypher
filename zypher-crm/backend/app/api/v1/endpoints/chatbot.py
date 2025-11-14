"""
Endpoints para chatbot de ventas conversacional
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging
import os

from app.core.database import get_db
from app.schemas.chatbot import (
    ChatRequest, ChatResponse, ChatMessage,
    PlansListResponse, PlanInfo
)
from app.services.openai_service import OpenAIService

logger = logging.getLogger(__name__)

router = APIRouter()

# Obtener API key de OpenAI desde variable de entorno
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY no configurada. Chatbot usará respuestas de fallback.")


def get_openai_service() -> OpenAIService:
    """Dependency para obtener servicio de OpenAI"""
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Servicio de chatbot no disponible. Configura OPENAI_API_KEY."
        )
    return OpenAIService(api_key=OPENAI_API_KEY)


@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(
    request: ChatRequest,
    openai_service: OpenAIService = Depends(get_openai_service)
) -> ChatResponse:
    """
    Enviar mensaje al chatbot y obtener respuesta

    El chatbot usa GPT-4 para conversaciones naturales sobre planes de suscripción
    """
    try:
        # Convertir historial a formato de OpenAI
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversation_history
        ] if request.conversation_history else []

        # Obtener respuesta del chatbot
        result = await openai_service.chat(
            user_message=request.message,
            conversation_history=conversation_history
        )

        if not result.get("success"):
            # Si falla OpenAI, usar respuesta de fallback
            bot_message = result.get("fallback_message", "Disculpa, hubo un problema. ¿Puedes repetir?")
            recommended_plan = None
            metadata = {"error": result.get("error"), "fallback": True}
        else:
            bot_message = result["message"]
            recommended_plan = result.get("recommended_plan")
            metadata = {
                "model": result.get("model"),
                "usage": result.get("usage"),
                "fallback": False
            }

        # Actualizar historial
        updated_history = conversation_history + [
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": bot_message}
        ]

        # Convertir de vuelta a ChatMessage
        history_messages = [
            ChatMessage(role=msg["role"], content=msg["content"])
            for msg in updated_history
        ]

        return ChatResponse(
            success=True,
            message=bot_message,
            recommended_plan=recommended_plan,
            conversation_history=history_messages,
            metadata=metadata
        )

    except Exception as e:
        logger.error(f"Error en chatbot: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando mensaje: {str(e)}"
        )


@router.get("/plans", response_model=PlansListResponse)
def get_available_plans(
    openai_service: OpenAIService = Depends(get_openai_service)
) -> PlansListResponse:
    """
    Obtener lista de planes disponibles

    Retorna todos los planes de suscripción con sus detalles
    """
    plans = openai_service.get_plans()

    plan_infos = [
        PlanInfo(**plan)
        for plan in plans
    ]

    return PlansListResponse(
        plans=plan_infos,
        total=len(plan_infos)
    )


@router.get("/plans/{plan_id}", response_model=PlanInfo)
def get_plan_details(
    plan_id: str,
    openai_service: OpenAIService = Depends(get_openai_service)
) -> PlanInfo:
    """
    Obtener detalles de un plan específico

    Args:
        plan_id: ID del plan (free, independiente, negocio, profesional, empresarial)
    """
    plan = openai_service.get_plan_by_id(plan_id)

    if not plan:
        raise HTTPException(
            status_code=404,
            detail=f"Plan '{plan_id}' no encontrado"
        )

    return PlanInfo(**plan)


@router.get("/health")
def chatbot_health() -> dict:
    """
    Verificar estado del servicio de chatbot

    Retorna información sobre la configuración y disponibilidad
    """
    has_api_key = bool(OPENAI_API_KEY)

    return {
        "status": "healthy" if has_api_key else "degraded",
        "openai_configured": has_api_key,
        "model": "gpt-4o-mini",
        "features": {
            "conversational_ai": has_api_key,
            "fallback_responses": True,
            "plan_recommendations": True
        },
        "message": "Chatbot operativo" if has_api_key else "Chatbot en modo fallback (configura OPENAI_API_KEY)"
    }
