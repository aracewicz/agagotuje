from pydantic import BaseModel, Field

class RatingCreate(BaseModel):

    score: int = Field(ge=1, le=5)
    recipe_id: int

class RatingOut(RatingCreate):

    id: int
    user_id: int

    class Config:
        
        from_attributes = True