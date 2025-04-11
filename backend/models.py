from sqlalchemy import Column, Integer, String
from pgvector.sqlalchemy import Vector
from database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    createdAt = Column(String, nullable=False)

class DocChunk(Base):
    __tablename__ = "doc_chunks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    embedding = Column(Vector(1536))  # for OpenAI ada-002
    source = Column(String, nullable=True)  # Optional: filename or section