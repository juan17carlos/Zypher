from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import engine
from app.models.base import Base

# Crear directorios necesarios
os.makedirs("app/storage/uploads", exist_ok=True)

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CRM Multi-industria - Sistema de gestión de clientes adaptable",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG
)

# Middleware para capturar excepciones globales
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        print(f"Error no controlado: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Error interno del servidor"}
        )

# Configurar CORS - MODO DUAL: dinámico desde settings (igual que facturación)
origins = settings.get_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de la API
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    """Endpoint para verificar el estado de la aplicación"""
    try:
        from sqlalchemy import text
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        print(f"Error en conexión a base de datos: {e}")
        db_status = "unhealthy"

    return {
        "status": "ok" if db_status == "healthy" else "error",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.on_event("startup")
async def startup_event():
    """Ejecutar al iniciar la aplicación"""
    print(f"🚀 Iniciando {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"📦 Entorno: {settings.ENVIRONMENT}")
    print(f"🐛 Debug mode: {settings.DEBUG}")
    print(f"🗄️  Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'configured'}")
    print("✅ Servidor iniciado y listo para recibir solicitudes")


@app.on_event("shutdown")
async def shutdown_event():
    """Ejecutar al cerrar la aplicación"""
    print("🛑 Cerrando aplicación...")
    print("🗄️  Cerrando pool de conexiones a base de datos...")
    engine.dispose()
    print("✅ Aplicación cerrada correctamente")
