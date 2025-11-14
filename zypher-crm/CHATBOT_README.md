# 🤖 Chatbot Conversacional con IA - Zypher CRM

Chatbot inteligente con GPT-4 para ayudar a los clientes a elegir el plan perfecto.

## 📦 Archivos Creados

### Backend (FastAPI)
```
backend/app/services/openai_service.py    - Servicio de integración con OpenAI
backend/app/schemas/chatbot.py             - Schemas Pydantic
backend/app/api/v1/endpoints/chatbot.py    - Endpoints REST API
backend/app/api/v1/api.py                  - Router actualizado
```

### Frontend (React + TypeScript)
```
frontend/src/services/chatbotService.ts           - Cliente API
frontend/src/components/ui/ChatWidget.tsx         - Componente de chat
```

---

## ⚙️ Configuración

### 1. Backend

#### Instalar dependencia de OpenAI:
```bash
cd backend
pip install openai httpx
```

#### Agregar OpenAI API Key en `.env`:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

Para obtener una API key:
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva key
3. Cópiala y pégala en el `.env`

### 2. Frontend

El componente ya está creado, solo necesitas integrarlo en tu app.

---

## 🚀 Uso

### Probar los endpoints (Backend)

Inicia el servidor:
```bash
cd backend
uvicorn app.main:app --reload
```

Endpoints disponibles:
```
POST /api/v1/chatbot/chat          - Enviar mensaje al chatbot
GET  /api/v1/chatbot/plans         - Obtener lista de planes
GET  /api/v1/chatbot/plans/{id}    - Obtener plan específico
GET  /api/v1/chatbot/health        - Estado del servicio
```

#### Ejemplo de request:
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, necesito un plan para mi negocio",
    "conversation_history": []
  }'
```

#### Ejemplo de response:
```json
{
  "success": true,
  "message": "¡Hola! 👋 Encantado de ayudarte. Para recomendarte el mejor plan, ¿me cuentas cuántas personas trabajarán usando el sistema?",
  "recommended_plan": null,
  "conversation_history": [
    {
      "role": "user",
      "content": "Hola, necesito un plan para mi negocio"
    },
    {
      "role": "assistant",
      "content": "¡Hola! 👋 Encantado de ayudarte..."
    }
  ],
  "metadata": {
    "model": "gpt-4o-mini",
    "usage": {
      "total_tokens": 156
    }
  }
}
```

### Integrar en el Frontend

#### Opción 1: En el componente principal (App.tsx):

```tsx
import ChatWidget from './components/ui/ChatWidget';

function App() {
  return (
    <div className="App">
      {/* Tu contenido actual */}

      {/* Agregar el chatbot */}
      <ChatWidget />
    </div>
  );
}
```

#### Opción 2: Solo en páginas específicas:

```tsx
// pages/Landing.tsx
import ChatWidget from '../components/ui/ChatWidget';

export default function Landing() {
  return (
    <div>
      <h1>Bienvenido a Zypher</h1>

      {/* Chatbot solo en landing */}
      <ChatWidget />
    </div>
  );
}
```

---

## 💡 Cómo Funciona

1. **Usuario abre el chat** (botón flotante en esquina inferior derecha)
2. **Saluda al bot** y describe sus necesidades
3. **Bot hace preguntas** para entender el contexto:
   - ¿Cuántos usuarios?
   - ¿Cuántos documentos por mes?
   - ¿Qué tipo de negocio?
4. **Bot recomienda un plan** basado en las respuestas
5. **Usuario puede preguntar** detalles, precios, comparaciones
6. **Bot sugiere siguiente paso** (activar plan, más información, etc.)

---

## 📊 Planes Disponibles

Los planes están hardcodeados en `openai_service.py`:

| Plan | Precio | Usuarios | Documentos | Destacado |
|------|--------|----------|------------|-----------|
| Gratis | $0 (30 días) | 1 | 25/año | Prueba |
| Independiente | $29/año | 1 | 200/año | Freelancers |
| Negocio | $55/año | 5 | 400/año | PYMEs |
| Profesional | $89/año | 15 | 1,200/año | 1 firma gratis |
| Empresarial | $149/año | ∞ | ∞ | Todo ilimitado |

---

## 🎨 Personalización

### Cambiar el System Prompt:

Edita `backend/app/services/openai_service.py`:

```python
self.system_prompt = """
Tu nuevo prompt aquí...
Sé más formal/informal/técnico/etc.
"""
```

### Cambiar el modelo de IA:

Por defecto usa `gpt-4o-mini` (más económico).

Para más inteligencia usa `gpt-4o`:
```python
self.model = "gpt-4o"  # Más caro pero mejor
```

### Cambiar colores del widget:

Edita `frontend/src/components/ui/ChatWidget.tsx`:

```tsx
// Cambiar color primario
className="bg-blue-600"  →  className="bg-green-600"

// Cambiar color del header
className="bg-gradient-to-r from-blue-600 to-blue-700"
→  className="bg-gradient-to-r from-purple-600 to-purple-700"
```

---

## 💰 Costos de OpenAI

Con `gpt-4o-mini`:
- ~$0.15 por 1M tokens de entrada
- ~$0.60 por 1M tokens de salida

**Estimación práctica:**
- Conversación promedio: ~300 tokens (~$0.0003)
- 1000 conversaciones: ~$0.30
- 10,000 conversaciones: ~$3

**Muy económico para empezar.**

---

## 🧪 Testing

### Test manual:

1. Inicia backend: `uvicorn app.main:app --reload`
2. Inicia frontend: `npm run dev`
3. Abre http://localhost:5173
4. Click en el botón del chatbot
5. Chatea: "Necesito un plan para 3 personas"

### Verificar health:

```bash
curl http://localhost:8000/api/v1/chatbot/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "openai_configured": true,
  "model": "gpt-4o-mini",
  "features": {
    "conversational_ai": true,
    "fallback_responses": true,
    "plan_recommendations": true
  }
}
```

---

## 🔥 Próximos Pasos

### FASE 1: MVP Funcional (Ya está ✅)
- [x] Backend con OpenAI
- [x] Frontend con chat UI
- [x] Planes hardcodeados
- [x] Recomendaciones inteligentes

### FASE 2: Integración con Pagos (Próximo)
- [ ] Traer NuveiService de facturacionelectronicapro
- [ ] Endpoint para crear orden de pago
- [ ] Botón "Activar plan" en el chat
- [ ] Webhook para confirmar pago
- [ ] Activación automática de suscripción

### FASE 3: Analytics y Mejoras
- [ ] Guardar conversaciones en DB
- [ ] Dashboard de métricas del chatbot
- [ ] A/B testing de prompts
- [ ] Respuestas pre-cacheadas para ahorrar costos

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no configurada"
✅ Solución: Agrega la key en `backend/.env`

### Error: "Module 'openai_service' not found"
✅ Solución: Instala dependencias `pip install openai httpx`

### Chatbot no responde naturalmente
✅ Solución: Verifica que la API key sea válida y tenga créditos

### Widget no aparece en el frontend
✅ Solución: Importa y usa `<ChatWidget />` en tu componente principal

---

## 📝 Notas Importantes

- El chatbot funciona **SIN base de datos** por ahora (todo en memoria)
- Las conversaciones **NO se persisten** al recargar la página
- Los planes están **hardcodeados** (luego se traerán de la DB)
- El modelo usa **gpt-4o-mini** para economizar costos
- Si OpenAI falla, hay **respuestas de fallback** simples

---

¡Listo para vender! 🚀
