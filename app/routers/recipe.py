from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.recipe import RecipeCreate, RecipeOut
from app.crud.recipe import create_recipe, get_recipe, get_all_recipes, delete_recipe

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.post("/", response_model=RecipeOut)
def new_recipe(data: RecipeCreate, db: Session = Depends(get_db)):

    return create_recipe(db, data, user_id=1) 

@router.get("/", response_model=list[RecipeOut])
def list_recipes(db: Session = Depends(get_db)):

    return get_all_recipes(db)

@router.get("/{recipe_id}", response_model=RecipeOut)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):

    recipe = get_recipe(db, recipe_id)
    if not recipe:
        
        raise HTTPException(404, "Recipe not found")
    return recipe

@router.delete("/{recipe_id}")
def remove_recipe(recipe_id: int, db: Session = Depends(get_db)):

    deleted = delete_recipe(db, recipe_id)
    if not deleted:

        raise HTTPException(404, "Recipe not found")
    return {"message": "deleted"}