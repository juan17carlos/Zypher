"""
Schemas para el chatbot de ventas
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    """Mensaje individual del chat"""
    role: str = Field(..., description="user o assistant")
    content: str = Field(..., description="Contenido del mensaje")
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Request para enviar mensaje al chatbot"""
    message: str = Field(..., min_length=1, max_length=500, description="Mensaje del usuario")
    conversation_history: Optional[List[ChatMessage]] = Field(default=[], description="Historial de conversación")
    session_id: Optional[str] = Field(default=None, description="ID de sesión para tracking")


class ChatResponse(BaseModel):
    """Respuesta del chatbot"""
    success: bool
    message: str = Field(..., description="Respuesta del bot")
    recommended_plan: Optional[str] = Field(default=None, description="ID del plan recomendado")
    conversation_history: List[ChatMessage] = Field(default=[], description="Historial actualizado")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Metadata adicional")


class PlanInfo(BaseModel):
    """Información de un plan de suscripción"""
    id: str
    name: str
    price: float
    currency: str = "USD"
    billing_period: str
    description: str
    features: List[str]
    limits: Dict[str, int]
    recommended_for: Optional[List[str]] = None


class PlansListResponse(BaseModel):
    """Lista de planes disponibles"""
    plans: List[PlanInfo]
    total: int
