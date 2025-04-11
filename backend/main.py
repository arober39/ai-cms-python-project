from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv
import openai
from openai import OpenAI
import os

from database import SessionLocal, engine
from models import Post
from schemas import PostCreate, PostOut, AskRequest
from models import DocChunk

# Load .env variables
load_dotenv()
client = OpenAI()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Create tables in the connected PostgreSQL database
print("🔧 Creating tables...")
Post.metadata.create_all(bind=engine)
DocChunk.metadata.create_all(bind=engine)
print("✅ Tables created (if not already present).")

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app instance
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# 🔹 CRUD Endpoints for /posts
# ----------------------------------

@app.get("/posts", response_model=list[PostOut])  
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

@app.get("/posts/{post_id}", response_model=PostOut)  
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/posts", response_model=PostOut)  
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.put("/posts/{post_id}", response_model=PostOut) 
def update_post(post_id: int, updated_post: PostCreate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.title = updated_post.title
    post.content = updated_post.content
    post.createdAt = updated_post.createdAt

    db.commit()
    db.refresh(post)
    return post

@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

# ----------------------------------
# 🔍 Vector Search on Docs (/ask-docs)
# ----------------------------------

@app.post("/ask-docs")
async def ask_docs(ask: AskRequest, db: Session = Depends(get_db)):
    question = ask.question
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    try:
        embedding_response = client.embeddings.create(
            input=question,
            model="text-embedding-ada-002"
        )
        question_embedding = embedding_response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

    try:
        results = db.execute(
            text("""
                SELECT id, content, source, 1 - (embedding <-> :embedding) AS similarity
                FROM doc_chunks
                ORDER BY embedding <-> (:embedding)::vector
                LIMIT 5
            """),
            {"embedding": question_embedding}
        ).fetchall()

        top_chunks = [
            {
                "id": row[0],
                "content": row[1],
                "source": row[2],
                "similarity": round(row[3], 4)
            }
            for row in results
        ]

        return {"matches": top_chunks}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search failed: {str(e)}")

# ----------------------------------
# 🤖 AI Answer Based on Docs (/answer-docs)
# ----------------------------------

@app.post("/answer-docs")
async def answer_docs(ask: AskRequest, db: Session = Depends(get_db)):
    question = ask.question
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")

    try:
        embedding_response = client.embeddings.create(
            input=question,
            model="text-embedding-ada-002"
        )
        question_embedding = embedding_response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

    try:
        results = db.execute(
            text("""
                SELECT content
                FROM doc_chunks
                ORDER BY embedding <-> (:embedding)::vector
                LIMIT 5
            """),
            {"embedding": question_embedding}
        ).fetchall()

        context_chunks = [r[0] for r in results]
        context = "\n\n".join(context_chunks)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector search failed: {str(e)}")

    try:
        chat_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant answering questions using only the documentation provided."
                },
                {
                    "role": "user",
                    "content": f"Documentation:\n{context}\n\nQuestion: {question}"
                }
            ],
            max_tokens=300
        )
        answer = chat_response.choices[0].message.content

        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
