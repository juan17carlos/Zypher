from fastapi import APIRouter
from app.api.v1.endpoints import auth, contacts, deals, tasks

api_router = APIRouter()

# Incluir todos los endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(deals.router, prefix="/deals", tags=["deals"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
