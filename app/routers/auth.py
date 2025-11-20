from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import RegisterUser, LoginUser, Token
from app.crud.user import create_user, get_user_by_email
from app.core.security import verify_password
from app.core.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register_user(data: RegisterUser, db: Session = Depends(get_db)):

    existing = get_user_by_email(db, data.email)
    if existing:

        raise HTTPException(400, "Email already exists")

    user = create_user(db, data)
    token = create_access_token({"user_id": user.id})
    return Token(access_token=token)

@router.post("/login", response_model=Token)
def login(data: LoginUser, db: Session = Depends(get_db)):

    user = get_user_by_email(db, data.email)
    if not user:

        raise HTTPException(400, "Invalid email or password")

    if not verify_password(data.password, user.password):

        raise HTTPException(400, "Invalid email or password")

    token = create_access_token({"user_id": user.id})
    return Token(access_token=token)