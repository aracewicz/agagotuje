from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryOut
from app.crud.category import (
    get_all_categories,
    get_category,
    create_category,
    delete_category
)

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):

    return get_all_categories(db)

@router.get("/{category_id}", response_model=CategoryOut)
def read_category(category_id: int, db: Session = Depends(get_db)):

    c = get_category(db, category_id)
    if not c:

        raise HTTPException(404, "Category not found")
    return c

@router.post("/", response_model=CategoryOut)
def add_category(data: CategoryCreate, db: Session = Depends(get_db)):

    return create_category(db, data)

@router.delete("/{category_id}")
def remove_category(category_id: int, db: Session = Depends(get_db)):

    success = delete_category(db, category_id)
    if not success:
        
        raise HTTPException(404, "Category not found")
    return {"detail": "Category deleted"}