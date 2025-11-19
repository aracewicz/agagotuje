from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Rating(Base):
    
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(Integer, nullable=False) 

    user_id = Column(Integer, ForeignKey("users.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    user = relationship("User", back_populates="ratings")
    recipe = relationship("Recipe", back_populates="ratings")