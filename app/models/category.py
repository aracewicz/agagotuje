from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

DEFAULT_CATEGORIES = [
    "Wypieki i Desery",
    "Dania z Mąki",
    "Dania Główne",
    "Dodatki",
    "Napoje"
]


class Category(Base):

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)


    recipes = relationship("Recipe", back_populates="category")
