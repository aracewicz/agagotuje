from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):

    email: EmailStr
    username: str

class UserCreate(UserBase):

    password: str = Field(..., min_length=6, max_length=72)

class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str

class UserOut(UserBase):

    id: int

    class Config:
        
        from_attributes = True