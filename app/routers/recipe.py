from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.recipe import RecipeCreate, RecipeOut, RecipeUpdate
from app.models.recipe import Recipe
from app.models.user import User
from app.crud.recipe import get_recipe, create_recipe, update_recipe, delete_recipe
from app.core.security import get_current_user, get_current_admin
from fastapi import File, UploadFile, Form
from uuid import uuid4

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/", response_model=List[RecipeOut])
def get_all_recipes(db: Session = Depends(get_db)):

    return db.query(Recipe).all()

@router.get("/{recipe_id}", response_model=RecipeOut)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):

    r = get_recipe(db, recipe_id)
    if not r:

        raise HTTPException(404, "Recipe not found")
    return r

@router.post("/", response_model=RecipeOut)
async def add_recipe(
    title: str = Form(...),
    description: str = Form(...),
    ingredients: str = Form(...),
    time: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_url = None

    if image:

        ext = image.filename.split(".")[-1].lower()
        filename = f"{uuid4()}.{ext}"
        file_path = f"app/static/recipes/{filename}"

        with open(file_path, "wb") as f:
            
            f.write(await image.read())

        image_url = f"/static/recipes/{filename}"

    recipe = create_recipe(
        db,
        data={
            "title": title,
            "description": description,
            "ingredients": ingredients,
            "time": time,
            "image_url": image_url
        },
        author_id=current_user.id
    )

    return recipe

@router.put("/{recipe_id}", response_model=RecipeOut)
def put_recipe(
    recipe_id: int,
    data: RecipeUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    
    recipe = get_recipe(db, recipe_id)
    if not recipe:

        raise HTTPException(404, "Recipe not found")
    return update_recipe(db, recipe, data)

@router.patch("/{recipe_id}", response_model=RecipeOut)
def patch_recipe(
    recipe_id: int,
    data: RecipeUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    
    recipe = get_recipe(db, recipe_id)
    if not recipe:
        
        raise HTTPException(404, "Recipe not found")
    return update_recipe(db, recipe, data)

@router.delete("/{recipe_id}")
def remove_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    
    recipe = get_recipe(db, recipe_id)
    if not recipe:

        raise HTTPException(404, "Recipe not found")

    delete_recipe(db, recipe)
    return {"detail": "Recipe deleted"}