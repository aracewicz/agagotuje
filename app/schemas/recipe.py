from pydantic import BaseModel
from typing import List

class RecipeBase(BaseModel):

    title: str
    ingredients: List[str]
    description: str
    steps: List[str]
    time_minutes: int

class RecipeCreate(RecipeBase):

    pass

class RecipeOut(RecipeBase):

    id: int
    user_id: int

    class Config:
        from_attributes = True