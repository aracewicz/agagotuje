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
from app.routers import user, recipe, rating, auth

app = FastAPI()
app.include_router(user.router)
app.include_router(recipe.router)
app.include_router(rating.router)
app.include_router(auth.router)
app.add_exception_handler(StarletteHTTPException, http_error_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


@app.on_event("startup")
def startup():

    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():

    return {"message": "API działa!"}