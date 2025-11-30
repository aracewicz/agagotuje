from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate

def get_all_categories(db: Session):

    return db.query(Category).all()

def get_category(db: Session, category_id: int):

    return db.query(Category).filter(Category.id == category_id).first()

def create_category(db: Session, data: CategoryCreate):

    c = Category(name=data.name)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

def delete_category(db: Session, category_id: int):

    c = get_category(db, category_id)
    if not c:
        
        return None
    db.delete(c)
    db.commit()
    return True