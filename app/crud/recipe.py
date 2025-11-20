from sqlalchemy.orm import Session
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate
import json

def create_recipe(db: Session, recipe: RecipeCreate, user_id: int):

    db_recipe = Recipe(
        title = recipe.title,
        ingredients = json.dumps(recipe.ingredients),
        description = recipe.description,
        steps = json.dumps(recipe.steps),
        time_minutes = recipe.time_minutes,
        user_id = user_id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def get_recipe(db: Session, recipe_id: int):

    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def get_all_recipes(db: Session):
    return db.query(Recipe).all()

def delete_recipe(db: Session, recipe_id: int):

    recipe = get_recipe(db, recipe_id)
    if recipe:
        
        db.delete(recipe)
        db.commit()
    return recipe