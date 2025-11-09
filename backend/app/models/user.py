from sqlalchemy import Column, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class UserRole(str, enum.Enum):
    """Roles de usuario en el sistema"""
    ADMIN = "ADMIN"
    USER = "USER"
    VIEWER = "VIEWER"


class User(BaseModel):
    """Modelo de usuario del sistema"""
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    # Relaciones
    # contacts = relationship("Contact", back_populates="owner")
    # deals = relationship("Deal", back_populates="owner")
    # tasks = relationship("Task", back_populates="assigned_to")

    def __repr__(self):
        return f"<User {self.email}>"
