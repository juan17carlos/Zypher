from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Zypher CRM"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/zypher_crm"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # CORS - Se carga dinámicamente desde get_cors_origins()
    BACKEND_CORS_ORIGINS: List[str] = []

    # Cookie Settings
    COOKIE_SECURE: bool = False
    COOKIE_HTTPONLY: bool = True
    COOKIE_SAMESITE: str = "lax"

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@zyphercrm.com"
    EMAILS_FROM_NAME: str = "Zypher CRM"

    # S3 / Storage
    USE_S3: bool = False
    S3_BUCKET_NAME: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    @property
    def IS_PRODUCTION(self) -> bool:
        return self.ENVIRONMENT == "production"

    def get_cors_origins(self) -> List[str]:
        """
        Obtiene los orígenes CORS permitidos según el entorno.
        Patrón igual al proyecto de facturación electrónica.
        """
        if self.IS_PRODUCTION:
            env_origins = os.getenv("CORS_ORIGINS_PRODUCTION")
            if env_origins:
                return [origin.strip() for origin in env_origins.split(',') if origin.strip()]
        else:
            env_origins = os.getenv("CORS_ORIGINS_DEVELOPMENT")
            if env_origins:
                return [origin.strip() for origin in env_origins.split(',') if origin.strip()]

        # Fallback por defecto
        base_origins = []

        if self.IS_PRODUCTION:
            base_origins = [
                "https://app.zypher.ec",
                "https://admin.zypher.ec",
                "https://www.zypher.ec",
            ]
        else:
            base_origins = [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
            ]

        return base_origins

    def __init__(self, **data):
        super().__init__(**data)

        # Cargar CORS dinámicamente al inicializar
        if not self.BACKEND_CORS_ORIGINS:
            self.BACKEND_CORS_ORIGINS = self.get_cors_origins()

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Permitir campos extras desde .env


settings = Settings()
