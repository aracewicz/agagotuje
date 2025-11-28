from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.core.oauth2 import oauth2_scheme

pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):

    try:
        
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")
        role = payload.get("role")  

        if user_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user ID"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

def get_current_admin(current_user: User = Depends(get_current_user)):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin permissions required"
        )
    return current_user


def hash_password(password: str) -> str:

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:

    return pwd_context.verify(plain_password, hashed_password)