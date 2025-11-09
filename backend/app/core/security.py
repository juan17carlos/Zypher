from datetime import datetime, timedelta
from typing import Optional, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

# Configurar contexto de encriptación para passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme para Bearer token
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar que el password coincida con el hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generar hash del password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crear token JWT

    Args:
        data: Información a codificar en el token
        expires_delta: Tiempo de expiración del token

    Returns:
        Token JWT como string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodificar y verificar token JWT

    Args:
        token: Token JWT a decodificar

    Returns:
        Datos del token si es válido, None si no
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Any:
    """
    Obtener usuario actual desde el token Bearer

    Args:
        credentials: Credenciales HTTP Bearer
        db: Sesión de base de datos

    Returns:
        Usuario actual

    Raises:
        HTTPException: Si el token es inválido o el usuario no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # Aquí deberías buscar el usuario en la base de datos
    # from app.models.user import User
    # user = db.query(User).filter(User.id == user_id).first()
    # if user is None:
    #     raise credentials_exception
    # return user

    # Por ahora retornamos el payload
    return payload


def get_current_user_from_cookies(request: Request) -> Optional[dict]:
    """
    Obtener datos del usuario desde cookies

    Args:
        request: Request de FastAPI

    Returns:
        Datos del usuario si el token es válido, None si no
    """
    token = request.cookies.get("access_token")

    if not token:
        return None

    return decode_access_token(token)
