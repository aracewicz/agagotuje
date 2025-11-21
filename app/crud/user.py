from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterUser
from app.core.security import hash_password

def get_user(db: Session, user_id: int):

    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):

    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, data: RegisterUser):

    user = User(
        email=data.email,
        username=data.username,
        password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    
    return db.query(User).filter(User.email == email).first()