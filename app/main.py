from fastapi import FastAPI
from app.core.database import Base, engine
from app.models import user, recipe, rating

app = FastAPI()

@app.on_event("startup")
def startup():

    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():

    return {"message": "API działa!"}