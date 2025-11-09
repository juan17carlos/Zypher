from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Note(BaseModel):
    """Modelo de nota"""
    __tablename__ = "notes"

    title = Column(String, nullable=True)
    content = Column(Text, nullable=False)

    # Relaciones
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=True)

    # author = relationship("User", back_populates="notes")
    # contact = relationship("Contact", back_populates="notes")
    # deal = relationship("Deal", back_populates="notes")

    def __repr__(self):
        return f"<Note {self.id} by User {self.author_id}>"
