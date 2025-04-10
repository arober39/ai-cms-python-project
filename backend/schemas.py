# schemas.py
from pydantic import BaseModel

class PostBase(BaseModel):
    title: str
    content: str
    createdAt: str

class PostCreate(PostBase):
    pass

class PostOut(PostBase):
    id: int

    class Config:
        orm_mode = True
