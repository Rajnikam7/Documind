# DocuMind — What We Built & What's Next

## Start Spring Backend
./mvnw spring-boot:run

## Create Virtual Environment
venv\Scripts\activate 

## Start FastAPI MicroService
uvicorn main:app --reload --port 8000

## What is this project?
An AI-powered document system. You upload a PDF, the system processes it, and you can ask questions about it in plain English. The AI answers based only on the document content.

---

## Architecture (Big Picture)

```
User (Postman / Frontend)
        ↓
Spring Boot (Java) — Port 8080
  - Receives file upload
  - Saves file to disk
  - Saves metadata to PostgreSQL
  - Calls FastAPI after saving
        ↓
FastAPI (Python) — Port 8000
  - Receives file path from Spring
  - Extracts text from PDF
  - Splits text into chunks
  - Converts chunks to embeddings (vectors)
  - Stores vectors in ChromaDB
  - Answers questions using Groq (Llama)
        ↓
ChromaDB (Vector Database) — runs locally in db/ folder
  - Stores embeddings (mathematical representations of text)
  - Finds most relevant chunks for a given question
        ↓
Groq API (llama-3.3-70b-versatile)
  - Gets relevant chunks as context
  - Answers the user's question
```

---

## What We Built — Phase by Phase

### Phase 1 — Spring Boot Backend ✅
- `Document.java` — Entity/model, maps to `documents` table in PostgreSQL
- `DocumentRepository.java` — Talks to DB via JPA (no SQL needed)
- `DocumentService.java` — Saves file to disk, saves metadata to DB, calls FastAPI via RestTemplate
- `DocumentController.java` — Exposes `POST /documents/upload` and `GET /documents`
- `GlobalExceptionHandler.java` — Catches all errors app-wide, returns clean JSON

### Phase 2 — Spring ↔ FastAPI Connection ✅
- Spring calls FastAPI using `RestTemplate` after every upload
- Sends `{ file_path (absolute), document_id }` as JSON
- Must use absolute path — relative paths break across different working directories
- Added logging so failures are visible in Spring terminal

### Phase 3 — RAG Pipeline in FastAPI ✅
Full pipeline working end-to-end:

**PDF → Text extraction**
- `PyPDFLoader` reads the PDF page by page
- Only works on text-based PDFs (not scanned/image PDFs)
- Scanned PDFs return empty text — need OCR (Tesseract) for those

**Text → Chunks**
- `RecursiveCharacterTextSplitter` splits text into 500-char chunks with 50-char overlap
- Overlap ensures context isn't lost at chunk boundaries
- Empty chunks are filtered out before storing

**Chunks → Embeddings**
- Used `sentence-transformers` directly (`all-MiniLM-L6-v2` model, ~90MB, downloads once)
- Avoided LangChain's `HuggingFaceEmbeddings` wrapper — it was returning empty vectors silently
- Custom `LocalEmbeddings` class wraps the model and plugs into ChromaDB

**Embeddings → ChromaDB**
- Vectors stored locally in `ai-service/db/` folder
- Each chunk tagged with `document_id` metadata for per-document filtering
- Uses `langchain_community.vectorstores.Chroma`

**Query → AI Answer (`POST /ask`)**
- Takes `{ question, document_id }`
- ChromaDB similarity search finds top 3 most relevant chunks for that document
- Chunks passed as context to Groq API
- Groq (Llama 3.3 70B) answers based only on the context

---

### Phase 4 — Spring Boot as Single Entry Point ✅
**Goal:** Frontend only talks to Spring Boot, never directly to FastAPI

**What we added:**

1. **Created `dto/` folder** — holds Data Transfer Objects (request/response shapes)
2. **Created `AskRequest.java`** — DTO for `{ "question": "..." }` JSON body
3. **Added `POST /documents/{id}/ask` endpoint** in `DocumentController`
   - Takes document ID from URL path (`@PathVariable`)
   - Takes question from request body (`@RequestBody AskRequest`)
   - Calls service layer
4. **Added `askQuestion()` method** in `DocumentService`
   - Builds payload: `{ question, document_id }`
   - Calls FastAPI `/ask` via `RestTemplate`
   - Returns clean response: `{ documentId, question, answer }`

**Flow:**
```
Client → POST /documents/10/ask → Spring Boot → FastAPI /ask → Groq → Answer → Spring → Client
```

**Why this matters:**
- Single API entry point (Spring Boot only)
- FastAPI is hidden behind Spring (microservice pattern)
- Easier to add auth, rate limiting, caching later
- Production-ready architecture

**Testing:**
```
POST http://localhost:8080/documents/10/ask
Content-Type: application/json

{
  "question": "What is the candidate's name?"
}
```

Response:
```json
{
  "documentId": 10,
  "question": "What is the candidate's name?",
  "answer": "RAJNIKAM"
}
```

---

## Key Concepts Learned

### Spring Boot Layers
```
Controller → Service → Repository → Database
```
- Controller = handles HTTP (like Express router)
- Service = business logic (like a service class in NestJS)
- Repository = DB access (like Prisma/Mongoose)
- Entity = table schema (like a Mongoose model)

### Hibernate / JPA
- ORM that converts Java objects ↔ SQL automatically
- `documentRepository.save(doc)` → Hibernate generates `INSERT INTO documents...`
- `@Entity` = this class is a DB table
- `@Id @GeneratedValue` = auto-increment primary key
- `show-sql=true` in properties = logs every SQL query in terminal

### Multipart File Upload
- JSON body can't carry binary files
- `multipart/form-data` is used for file uploads
- In Spring: `@RequestParam("file") MultipartFile file`
- In Postman: Body → form-data → key `file`, type `File`

### RAG (Retrieval Augmented Generation)
```
❌ Raw question → AI guesses from training data
✅ Question → find relevant chunks → give as context → AI answers from document only
```
Why? AI models don't know your documents. RAG bridges that gap by retrieving relevant content first.

### Embeddings & Vector Search
- Text is converted to vectors (lists of numbers) that represent meaning
- Similar meaning = similar vectors = close distance in vector space
- ChromaDB stores these vectors and finds the closest ones to your query
- This is how "semantic search" works — finds meaning, not just keywords

### AI Model Choices
- Tried Gemini 1.5-flash → model not found on free tier
- Tried Gemini 2.0-flash → quota exhausted (limit: 0 on free tier)
- Switched to Groq → free tier, no billing, fast
- `llama3-8b-8192` was decommissioned → using `llama-3.3-70b-versatile` ✅

---

## Troubleshooting Log (Real Issues We Hit)

| Error | Cause | Fix |
|-------|-------|-----|
| `MultipartException: not a multipart request` | Postman sending JSON not form-data | Switch Body to form-data, key type to File |
| FastAPI 404 on `/process-document` | Relative file path, file not found | Use `filePath.toAbsolutePath()` in Spring |
| `Expected Embeddings to be non-empty list` | LangChain HuggingFaceEmbeddings wrapper broken | Custom `LocalEmbeddings` class using sentence-transformers directly |
| `Total chunks: 0` | Scanned/image PDF, no extractable text | Use a text-based PDF (one where you can select text) |
| Gemini 404 model not found | Wrong model name for API version | Switch to gemini-2.0-flash |
| Gemini 429 quota exhausted | Free tier limit hit | Switched to Groq |
| `llama3-8b-8192` decommissioned | Model removed by Groq | Use `llama-3.3-70b-versatile` |

---

## Install Commands

**FastAPI side:**
```bash
pip install fastapi uvicorn langchain langchain-community langchain-text-splitters chromadb pypdf sentence-transformers groq python-dotenv
```

**Spring Boot side:** all dependencies in `pom.xml` (spring-web, spring-data-jpa, postgresql, devtools)

---

## Current File Structure

```
P2/
├── documind/                          ← Spring Boot (port 8080)
│   ├── src/main/java/com/raj/documind/
│   │   ├── controller/DocumentController.java
│   │   ├── service/DocumentService.java
│   │   ├── repository/DocumentRepository.java
│   │   ├── entity/Document.java
│   │   ├── dto/AskRequest.java        ← NEW: request body shape
│   │   └── exception/GlobalExceptionHandler.java
│   ├── src/main/resources/application.properties
│   └── uploads/                       ← uploaded files saved here
│
└── ai-service/                        ← FastAPI (port 8000)
    ├── main.py
    ├── requirements.txt
    ├── .env                           ← API keys (never commit this)
    └── db/                            ← ChromaDB vector store (auto-created)
```

---

## API Endpoints

| Method | URL | Service | Description |
|--------|-----|---------|-------------|
| POST | `/documents/upload` | Spring :8080 | Upload PDF, saves file + metadata, triggers AI processing |
| GET | `/documents` | Spring :8080 | List all uploaded documents |
| POST | `/documents/{id}/ask` | Spring :8080 | **NEW:** Ask question about a document (proxies to FastAPI) |
| POST | `/process-document` | FastAPI :8000 | Called by Spring — extracts, chunks, embeds PDF |
| POST | `/ask` | FastAPI :8000 | Ask a question about a document (called by Spring, not directly) |
| GET | `/health` | FastAPI :8000 | Health check |

---

## Next Steps

1. ~~Add `POST /documents/{id}/ask` in Spring Boot~~ ✅ DONE
2. Add validation: check if document exists before calling FastAPI
3. Add logging for better debugging
4. Later: chat history, multi-document search, OCR for scanned PDFs

---

## API Keys

- Groq → https://console.groq.com/keys (free, no billing)
- Store in `ai-service/.env` as `GROQ_API_KEY=...`
- Never hardcode keys in source, never commit `.env`

