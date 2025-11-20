from fastapi import FastAPI
from app.core.database import Base, engine
from app.models import user, recipe, rating
from app.routers import user, recipe, rating, auth

app = FastAPI()
app.include_router(user.router)
app.include_router(recipe.router)
app.include_router(rating.router)
app.include_router(auth.router)

@app.on_event("startup")
def startup():

    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():

    return {"message": "API działa!"}