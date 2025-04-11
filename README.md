# Full-Stack RAG App: Typescript + Python + PostgreSQL + OpenAI + CKEditor

This project is a full-stack application that allows users to:

- Create and manage content (CMS)
- Ingest real documentation (`.md`, `.txt`) into a vector database
- Ask natural language questions
- Get AI-powered answers grounded in your own documentation (RAG = Retrieval Augmented Generation)

---

## Create New Post
![Create New Post](frontend_createpost.png)

## View, Edit, Delete All Posts
![Edit Post](allposts.png)

## Ask Questions Against the Ingested Documentation (CKE Docs)
![Ask Questions](ask_docs.png)

## Stack Overview

| Layer         | Tech                     |
|---------------|--------------------------|
| **Frontend**  | React + TypeScript       |
| **Backend**   | FastAPI (Python 3.12)    |
| **Vector DB** | PostgreSQL + pgvector    |
| **AI**        | OpenAI Embeddings + GPT  |
| **Auth**      | (Optional, future-ready) |

---

## Features
- Rich Text Editing with CKEditor
- Document ingestion pipeline
- Vector search using OpenAI embeddings
- GPT-powered question answering with citations
- Full CRUD for posts via REST API
- Frontend search interface using `/answer-docs`

---

## Project Structure
![Project Structure](fullstack_project_structure.png)

## Setup Instructions

### 1️. Clone the Repo
git clone https://github.com/yourusername/rag-assistant-app.git
cd rag-assistant-app

### 2. Backend Setup (Python 3.12)
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt

## Create .env in /backend/:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mycms

### 3. Setup PostgreSQL with pgvector
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mycms \
  -p 5432:5432 \
  -d ankane/pgvector

Then inside psql:

CREATE EXTENSION vector;

### 4. Ingest Documentation
python ingest_docs.py

### 5. Start the Backend
uvicorn main:app --reload

Open Swagger: http://localhost:8000/docs

### 5. Frontend Setup
cd frontend
npm install
npm start

React App runs on: http://localhost:3000

## Key Endpoints
| Route                 | Description                              |
|-----------------------|------------------------------------------|
| **POST /posts**       | Create CMS post                          |
| **POST /ask-docs**    | Vector search on documentation chunks    |
| **POST /answer-docs** | Full RAG answer with GPT + top chunks    |

## Credits & Acknowledgements
- FastAPI
- OpenAI API
- pgvector
- LangChain TextSplitter
- CKEditor

## License
MIT License

Copyright (c) 2025 Alexis Roberson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
