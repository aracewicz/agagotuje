from pydantic import BaseModel
from typing import List

class RecipeBase(BaseModel):

    title: str
    ingredients: List[str]
    description: str
    time: int
class RecipeCreate(RecipeBase):

    pass

class RecipeUpdate(BaseModel):
    title: str | None = None
    description: str | None = None

class RecipeOut(RecipeBase):

    id: int
    author_id: int
    image_url: str | None = None

    class Config:

        from_attributes = True
