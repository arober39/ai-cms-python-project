import os
import openai
from openai import OpenAI
from sqlalchemy.orm import Session
from langchain.text_splitter import CharacterTextSplitter
from dotenv import load_dotenv
from database import SessionLocal
from models import DocChunk

client = OpenAI()

# Optional: for PDF support
# try:
#    import fitz  # PyMuPDF
#    pdf_supported = True
#except ImportError:
#    pdf_supported = False

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Embedding function
def embed_text(text: str):
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

# Split + store in DB
def chunk_and_store(content: str, source: str):
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(content)

    db: Session = SessionLocal()
    for chunk in chunks:
        embedding = embed_text(chunk)
        doc = DocChunk(content=chunk, embedding=embedding, source=source)
        db.add(doc)

    db.commit()
    db.close()
    print(f"✅ Ingested {len(chunks)} chunks from {source}")

# Handle one file
def ingest_file(filepath: str):
    ext = os.path.splitext(filepath)[-1].lower()
    print(f"📄 Ingesting file: {filepath}")

    try:
        if ext in [".txt", ".md"]:
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
                chunk_and_store(text, filepath)
        else:
            print(f"⚠️ Skipped unsupported file type: {ext}")
    except Exception as e:
        print(f"❌ Failed to ingest {filepath}: {e}")

# Walk through all files in docs/ and subfolders
def ingest_directory(base_dir: str = "docs"):
    for root, _, files in os.walk(base_dir):
        for filename in files:
            filepath = os.path.join(root, filename)
            if os.path.isfile(filepath):
                ingest_file(filepath)

# Run
if __name__ == "__main__":
    ingest_directory()
