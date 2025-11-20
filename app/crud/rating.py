from sqlalchemy.orm import Session
from app.models.rating import Rating
from app.schemas.rating import RatingCreate

def create_rating(db: Session, rating: RatingCreate, user_id: int):

    db_rating = Rating(
        score=rating.score,
        recipe_id=rating.recipe_id,
        user_id=user_id
    )
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

def get_ratings_for_recipe(db: Session, recipe_id: int):
    
    return db.query(Rating).filter(Rating.recipe_id == recipe_id).all()