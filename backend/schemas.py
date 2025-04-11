from pydantic import BaseModel
from typing import Optional

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


class AskRequest(BaseModel):
    question: str

# (Optional) If you want to return top chunks too
class ChunkMatch(BaseModel):
    id: int
    content: str
    source: Optional[str]
    similarity: Optional[float]