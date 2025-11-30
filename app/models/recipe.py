from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

class Recipe(Base):
    
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    ingredients = Column(JSONB, nullable=False)
    description = Column(Text, nullable=False)
    # ForeignKey points to default table name `users`
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_url = Column(String, nullable=True)
    time = Column(Integer,nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="recipes")
    author = relationship("User", back_populates="recipes")
    ratings = relationship("Rating", back_populates="recipe")
