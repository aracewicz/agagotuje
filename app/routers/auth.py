from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:

        raise HTTPException(status_code=400, detail="Email already in use")

    hashed = hash_password(user_data.password)

    new_user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed,
        role="user" 
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):

        raise HTTPException(status_code=400, detail="Invalid email or password")


    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {  
        "access_token": access_token,
        "token_type": "bearer"
    }