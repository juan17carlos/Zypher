"""
Servicio de integración con OpenAI GPT-4 para chatbot de ventas
"""
import httpx
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Planes de suscripción (hardcoded por ahora)
SUBSCRIPTION_PLANS = [
    {
        "id": "free",
        "name": "Gratis",
        "price": 0,
        "billing_period": "30 días prueba",
        "description": "Ideal para probar nuestro sistema",
        "features": ["25 documentos/año", "1 usuario", "25 clientes", "Dashboard básico"],
        "limits": {"documents": 25, "users": 1, "clients": 25}
    },
    {
        "id": "independiente",
        "name": "Independiente",
        "price": 29,
        "billing_period": "año",
        "description": "Perfecto para freelancers y profesionales independientes",
        "features": ["200 documentos/año", "1 usuario", "50 clientes", "Chat soporte", "5% descuento firmas"],
        "limits": {"documents": 200, "users": 1, "clients": 50},
        "recommended_for": ["freelancer", "independiente", "profesional", "solo"]
    },
    {
        "id": "negocio",
        "name": "Negocio",
        "price": 55,
        "billing_period": "año",
        "description": "Ideal para pequeñas empresas",
        "features": ["400 documentos/año", "5 usuarios", "100 clientes", "Chat soporte", "7.5% descuento firmas"],
        "limits": {"documents": 400, "users": 5, "clients": 100},
        "recommended_for": ["pequeña empresa", "pyme", "negocio", "tienda", "equipo"]
    },
    {
        "id": "profesional",
        "name": "Profesional",
        "price": 89,
        "billing_period": "año",
        "description": "Para empresas en crecimiento",
        "features": ["1,200 documentos/año", "15 usuarios", "Clientes ilimitados", "Dashboard profesional",
                     "Reportes avanzados", "Gestión de gastos", "1 firma GRATIS", "10% descuento firmas"],
        "limits": {"documents": 1200, "users": 15, "clients": -1},
        "recommended_for": ["crecimiento", "mediana empresa", "expandiendo", "equipo grande"]
    },
    {
        "id": "empresarial",
        "name": "Empresarial",
        "price": 149,
        "billing_period": "año",
        "description": "Plataforma empresarial completa",
        "features": ["TODO ILIMITADO", "ATS automático", "Soporte prioritario",
                     "1 firma GRATIS", "12.5% descuento firmas"],
        "limits": {"documents": -1, "users": -1, "clients": -1},
        "recommended_for": ["empresa", "corporativo", "gran volumen", "ilimitado"]
    }
]


class OpenAIService:
    """Servicio para integración con OpenAI GPT-4"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-4o-mini"  # Más económico que gpt-4

        # System prompt para el chatbot de ventas
        self.system_prompt = """Eres un asistente de ventas experto para Zypher, un sistema de CRM y facturación electrónica en Ecuador.

Tu objetivo es ayudar a los clientes a encontrar el plan perfecto para sus necesidades.

PLANES DISPONIBLES:
1. Gratis: $0 (30 días prueba) - 25 docs, 1 usuario, 25 clientes
2. Independiente: $29/año - 200 docs, 1 usuario, 50 clientes, chat soporte
3. Negocio: $55/año - 400 docs, 5 usuarios, 100 clientes, chat soporte
4. Profesional: $89/año - 1,200 docs, 15 usuarios, clientes ilimitados, dashboard profesional, 1 firma gratis
5. Empresarial: $149/año - TODO ILIMITADO, ATS automático, soporte prioritario

INSTRUCCIONES:
- Sé amigable, profesional y conversacional
- Haz preguntas para entender las necesidades del cliente
- Recomienda el plan más adecuado según:
  * Número de usuarios
  * Volumen de documentos mensuales/anuales
  * Tipo de negocio (freelancer, pyme, empresa)
- Explica CLARAMENTE los beneficios del plan recomendado
- Si preguntan precios, menciónalos en dólares ($)
- Si preguntan por facturación electrónica, confirma que TODOS los planes la incluyen
- Mantén respuestas cortas (máximo 3-4 líneas)
- Usa emojis ocasionalmente para ser amigable 😊
- Al final de la conversación, ofrece "¿Quieres que active este plan?" o "¿Necesitas más información?"

NUNCA:
- No inventes features que no existen
- No des precios incorrectos
- No prometas descuentos que no están listados"""

    async def chat(self,
                   user_message: str,
                   conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Envía mensaje a GPT-4 y obtiene respuesta

        Args:
            user_message: Mensaje del usuario
            conversation_history: Historial de conversación [{"role": "user"|"assistant", "content": "..."}]

        Returns:
            Dict con la respuesta y metadata
        """
        try:
            # Construir mensajes
            messages = [
                {"role": "system", "content": self.system_prompt}
            ]

            # Agregar historial si existe (máximo últimos 10 mensajes)
            if conversation_history:
                messages.extend(conversation_history[-10:])

            # Agregar mensaje actual
            messages.append({
                "role": "user",
                "content": user_message
            })

            # Llamar a OpenAI API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 300,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }

            logger.info(f"Enviando mensaje a OpenAI: {user_message[:50]}...")

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    json=payload,
                    headers=headers
                )

                if response.status_code == 200:
                    result = response.json()

                    assistant_message = result["choices"][0]["message"]["content"]
                    usage = result.get("usage", {})

                    logger.info(f"Respuesta recibida. Tokens usados: {usage.get('total_tokens', 0)}")

                    # Detectar si mencionó un plan específico
                    recommended_plan = self._detect_recommended_plan(assistant_message)

                    return {
                        "success": True,
                        "message": assistant_message,
                        "recommended_plan": recommended_plan,
                        "usage": usage,
                        "model": self.model
                    }
                else:
                    error_msg = f"Error OpenAI API: {response.status_code} - {response.text}"
                    logger.error(error_msg)

                    return {
                        "success": False,
                        "error": error_msg,
                        "fallback_message": self._get_fallback_response(user_message)
                    }

        except httpx.TimeoutException:
            logger.error("Timeout llamando a OpenAI API")
            return {
                "success": False,
                "error": "Timeout",
                "fallback_message": "Disculpa, estoy tardando en responder. ¿Puedes repetir tu pregunta?"
            }

        except Exception as e:
            logger.error(f"Error en OpenAI chat: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "fallback_message": self._get_fallback_response(user_message)
            }

    def _detect_recommended_plan(self, message: str) -> Optional[str]:
        """Detecta si el mensaje recomienda un plan específico"""
        message_lower = message.lower()

        # Orden de prioridad: más específico primero
        if "empresarial" in message_lower:
            return "empresarial"
        elif "profesional" in message_lower:
            return "profesional"
        elif "negocio" in message_lower:
            return "negocio"
        elif "independiente" in message_lower:
            return "independiente"
        elif "gratis" in message_lower or "prueba" in message_lower:
            return "free"

        return None

    def _get_fallback_response(self, user_message: str) -> str:
        """Respuesta de fallback si OpenAI falla"""
        message_lower = user_message.lower()

        # Respuestas simples basadas en keywords
        if any(word in message_lower for word in ["precio", "costo", "cuanto", "cuánto"]):
            return ("Nuestros planes van desde $29 a $149 al año. "
                   "¿Cuántos usuarios y documentos necesitas aproximadamente?")

        elif any(word in message_lower for word in ["plan", "planes"]):
            return ("Tenemos 5 planes: Gratis (prueba), Independiente ($29), Negocio ($55), "
                   "Profesional ($89) y Empresarial ($149). ¿Cuál te interesa conocer?")

        elif any(word in message_lower for word in ["hola", "buenos", "buenas"]):
            return ("¡Hola! 👋 Soy el asistente de Zypher. "
                   "¿Te ayudo a encontrar el plan perfecto para tu negocio?")

        else:
            return ("Disculpa, no pude procesar tu mensaje. "
                   "¿Quieres que te cuente sobre nuestros planes?")

    def get_plans(self) -> List[Dict[str, Any]]:
        """Obtiene la lista de planes disponibles"""
        return SUBSCRIPTION_PLANS

    def get_plan_by_id(self, plan_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene un plan específico por ID"""
        for plan in SUBSCRIPTION_PLANS:
            if plan["id"] == plan_id:
                return plan
        return None

    def format_plan_details(self, plan_id: str) -> str:
        """Formatea los detalles de un plan para mostrar"""
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            return "Plan no encontrado"

        price_str = f"${plan['price']}" if plan['price'] > 0 else "Gratis"
        features_str = "\n".join([f"✓ {feature}" for feature in plan['features']])

        return f"""
**{plan['name']}** - {price_str}/{plan['billing_period']}

{plan['description']}

{features_str}
        """.strip()
