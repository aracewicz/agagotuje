from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.rating import RatingCreate, RatingOut
from app.crud.rating import create_rating, get_ratings_for_recipe

router = APIRouter(prefix="/ratings", tags=["Ratings"])

@router.post("/", response_model=RatingOut)
def add_rating(data: RatingCreate, db: Session = Depends(get_db)):

    return create_rating(db, data, user_id=1)

@router.get("/recipe/{recipe_id}", response_model=list[RatingOut])
def list_ratings(recipe_id: int, db: Session = Depends(get_db)):
    
    return get_ratings_for_recipe(db, recipe_id)