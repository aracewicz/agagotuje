from fastapi import FastAPI
from app.core.database import Base, engine
from app.models import user, recipe, rating
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError
from app.core.errors import (
    http_error_handler,
    validation_exception_handler,
    unhandled_exception_handler
)
from app.routers import user, recipe, rating, auth, category
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.models.category import Category, DEFAULT_CATEGORIES
from app.core.database import SessionLocal
from app.core.security import get_current_admin


app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("app/static/favicon.ico")

app.include_router(user.router)
app.include_router(recipe.router)
app.include_router(rating.router)
app.include_router(auth.router)
app.include_router(category.router)
app.add_exception_handler(StarletteHTTPException, http_error_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

@app.on_event("startup")
@app.on_event("startup")
def startup():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:

        if db.query(Category).count() == 0:

            for name in DEFAULT_CATEGORIES:

                db.add(Category(name=name))
            db.commit()
            print("✓ Dodano domyślne kategorie.")
    finally:
        
        db.close()

@app.get("/")
def root():

    return {"message": "API działa!"}
