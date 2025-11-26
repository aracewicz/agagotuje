from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.recipe import RecipeCreate, RecipeOut, RecipeUpdate
from app.crud.recipe import get_recipe, create_recipe, update_recipe, delete_recipe
from typing import List

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/", response_model=List[RecipeOut])
def get_all_recipes(db: Session = Depends(get_db)):
    return db.query(RecipeCreate).all()

@router.get("/{recipe_id}", response_model=RecipeOut)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):

    r = get_recipe(db, recipe_id)
    if not r:

        raise HTTPException(404, "Recipe not found")
    return r

@router.post("/", response_model=RecipeOut)
def add_recipe(data: RecipeCreate, db: Session = Depends(get_db)):

    return create_recipe(db, data, user_id=1)

@router.put("/{recipe_id}", response_model=RecipeOut)
def put_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):

    recipe = get_recipe(db, recipe_id)
    if not recipe:

        raise HTTPException(404, "Recipe not found")
    return update_recipe(db, recipe, data)

@router.patch("/{recipe_id}", response_model=RecipeOut)
def patch_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):

    recipe = get_recipe(db, recipe_id)
    if not recipe:
        
        raise HTTPException(404, "Recipe not found")
    return update_recipe(db, recipe, data)

@router.delete("/{recipe_id}")
def remove_recipe(recipe_id: int, db: Session = Depends(get_db)):
    
    recipe = get_recipe(db, recipe_id)
    if not recipe:

        raise HTTPException(404, "Recipe not found")
    delete_recipe(db, recipe)
    return {"detail": "Recipe deleted"}