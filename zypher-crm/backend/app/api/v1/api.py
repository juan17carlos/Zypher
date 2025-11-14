from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    contacts,
    deals,
    tasks,
    task_templates,
    automation_rules,
    task_dependencies,
    chatbot
)

api_router = APIRouter()

# Incluir todos los endpoints - PHASE 1
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(deals.router, prefix="/deals", tags=["deals"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

# Incluir endpoints PHASE 2
api_router.include_router(task_templates.router, prefix="/task-templates", tags=["task-templates"])
api_router.include_router(automation_rules.router, prefix="/automation-rules", tags=["automation-rules"])
api_router.include_router(task_dependencies.router, prefix="/task-dependencies", tags=["task-dependencies"])

# Chatbot conversacional con IA
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
