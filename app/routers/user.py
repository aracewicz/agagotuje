from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserOut
from app.crud.user import get_user, create_user, get_user_by_email


router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):

    existing = get_user_by_email(db, user.email)
    if existing:
        
        raise HTTPException(status_code=400, detail="Email already used")
    return create_user(db, user)

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):

    u = get_user(db, user_id)
    if not u:

        raise HTTPException(status_code=404, detail="User not found")
    return u