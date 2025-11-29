from sqlalchemy.orm import Session
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate
import json

def get_recipe(db: Session, recipe_id: int):

    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def create_recipe(db: Session, data: dict, user_id: int):

    recipe = Recipe(
        title=data["title"],
        ingredients=data["ingredients"],
        description=data["description"],
        time=data["time"],
        image_url=data.get("image_url"),
        author_id=user_id
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe

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