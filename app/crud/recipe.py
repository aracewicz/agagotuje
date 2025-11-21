from sqlalchemy.orm import Session
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate
import json

def get_recipe(db: Session, recipe_id: int):

    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

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

def update_recipe(db: Session, recipe: Recipe, data: RecipeUpdate):

    if data.title is not None:

        recipe.title = data.title
    if data.description is not None:

        recipe.description = data.description

    db.commit()
    db.refresh(recipe)
    return recipe

def delete_recipe(db: Session, recipe: Recipe):

    db.delete(recipe)
    db.commit()