# DocuMind — AI-Powered Document Intelligence System

> Upload any PDF document and ask questions about it in plain English. DocuMind uses RAG (Retrieval Augmented Generation) to provide accurate, context-aware answers powered by Groq's Llama 3.3 70B model.

---

## Live Demo

> Coming soon

---

## What is this?

DocuMind is a **full-stack AI document Q&A system** built with a microservice architecture. It demonstrates how modern AI techniques (RAG, vector embeddings, LLMs) can be integrated into a production-style backend system.

The system supports **two independent AI microservices** — one built in Python (FastAPI) and one in Node.js (Express) — both capable of processing PDFs and answering questions. The React frontend lets users choose which service to use.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│              (Vite + React, Port 5173)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────────┐
│               Spring Boot Backend (Java)                 │
│                     Port 8080                            │
│  • File upload & storage                                 │
│  • PostgreSQL metadata storage                           │
│  • Routes to AI services via RestTemplate               │
└───────────┬────────────────────────┬────────────────────┘
            │ HTTP                   │ HTTP
┌───────────▼──────────┐  ┌──────────▼─────────────────┐
│  Python AI Service   │  │   Node.js AI Service        │
│  FastAPI, Port 8000  │  │   Express.js, Port 8001     │
│                      │  │                             │
│  • PyPDFLoader       │  │  • pdf-parse                │
│  • LangChain         │  │  • Custom chunking          │
│  • ChromaDB          │  │  • ChromaDB JS client       │
│  • Groq (Llama 3.3)  │  │  • Groq (Llama 3.3)        │
└──────────────────────┘  └─────────────────────────────┘
```

---

## Tech Stack

### Backend — Spring Boot (Java)
| Tech | Purpose |
|------|---------|
| Spring Boot 4 | REST API framework |
| Spring Data JPA + Hibernate | ORM, database access |
| PostgreSQL | Document metadata storage |
| RestTemplate | HTTP client for AI service calls |
| Maven | Build tool |

### Python AI Service
| Tech | Purpose |
|------|---------|
| FastAPI | REST API framework |
| LangChain | PDF loading, text splitting |
| ChromaDB | Vector database (local) |
| sentence-transformers (`all-MiniLM-L6-v2`) | Text embeddings |
| Groq SDK (`llama-3.3-70b-versatile`) | LLM for Q&A |

### Node.js AI Service
| Tech | Purpose |
|------|---------|
| Express.js | REST API framework |
| pdf-parse | PDF text extraction |
| chromadb (JS client) | Vector database |
| groq-sdk | LLM for Q&A |

### Frontend — React
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI framework |
| Fetch API | HTTP requests |
| CSS3 | Styling (no UI libraries) |

---

## Features

- 📤 **Drag & drop PDF upload** with real-time processing feedback
- 🤖 **RAG pipeline** — extracts, chunks, embeds, and stores document content
- 💬 **Chat interface** — ask questions and get AI-powered answers
- 🔀 **Dual AI services** — toggle between Python and Node.js AI backends
- 📋 **Document history** — browse and re-query previously uploaded documents
- 🛡️ **Global error handling** — clean JSON error responses across all layers
- 📱 **Fully responsive** — works on mobile, tablet, and desktop

---

## How RAG Works (in this project)

```
1. Upload PDF
      ↓
2. Extract text (PyPDFLoader / pdf-parse)
      ↓
3. Split into chunks (500 chars, 50 overlap)
      ↓
4. Generate embeddings (sentence-transformers all-MiniLM-L6-v2)
      ↓
5. Store in ChromaDB (tagged with document_id)
      ↓
6. User asks a question
      ↓
7. Question → embedding → similarity search (top 3 chunks)
      ↓
8. Chunks + question → Groq LLM (Llama 3.3 70B)
      ↓
9. AI answers based ONLY on document content
```

RAG ensures the AI answers from your document, not from its general training data.

---

## Project Structure

```
DocuMind/
│
├── documind/                          # Spring Boot backend
│   └── src/main/java/com/raj/documind/
│       ├── controller/                # HTTP endpoints
│       ├── service/                   # Business logic + AI routing
│       ├── repository/                # Database access (JPA)
│       ├── entity/                    # Document model
│       ├── dto/                       # Request/response shapes
│       ├── config/                    # CORS configuration
│       └── exception/                 # Global error handling
│
├── ai-service/                        # Python AI microservice
│   ├── main.py                        # FastAPI app
│   └── requirements.txt
│
├── ai-service-node/                   # Node.js AI microservice
│   └── src/
│       ├── app.js                     # Express app
│       ├── routes/documents.js        # API routes
│       └── services/
│           ├── pdfService.js          # PDF extraction + chunking
│           ├── embeddingService.js    # Vector generation
│           ├── vectorService.js       # ChromaDB operations
│           └── llmService.js          # Groq LLM calls
│
└── documind-frontend/                 # React frontend
    └── src/
        ├── features/documents/        # Upload, chat, document list
        ├── pages/                     # Page components
        ├── lib/api.js                 # API client
        ├── utils/                     # Helpers
        └── styles/                    # Global CSS
```

---

## API Endpoints

### Spring Boot (Port 8080)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/documents/upload` | Upload PDF → Python AI |
| `POST` | `/documents/upload/node` | Upload PDF → Node AI |
| `GET` | `/documents` | List all documents |
| `POST` | `/documents/{id}/ask` | Ask question → Python AI |
| `POST` | `/documents/{id}/ask/node` | Ask question → Node AI |

### Python AI Service (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/process-document` | Extract, chunk, embed PDF |
| `POST` | `/ask` | Answer question using RAG |
| `GET` | `/health` | Health check |

### Node.js AI Service (Port 8001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/process-document` | Extract, chunk, embed PDF |
| `POST` | `/ask` | Answer question using RAG |
| `GET` | `/health` | Health check |

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Python 3.10+
- PostgreSQL
- [Groq API key](https://console.groq.com/keys) (free)

---

### 1. Clone the repo

```bash
git clone https://github.com/Rajnikam7/Documind.git
cd Documind
```

---

### 2. Spring Boot Setup

```bash
cd documind
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/DocuMind
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Run:
```bash
./mvnw spring-boot:run
```

---

### 3. Python AI Service Setup

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `.env`:
```
GROQ_API_KEY=your_groq_key_here
```

Run:
```bash
uvicorn main:app --reload --port 8000
```

---

### 4. Node.js AI Service Setup

```bash
cd ai-service-node
npm install
```

Edit `.env`:
```
PORT=8001
GROQ_API_KEY=your_groq_key_here
```

Run:
```bash
npm run dev
```

---

### 5. Frontend Setup

```bash
cd documind-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Port Reference

| Service | Port |
|---------|------|
| React Frontend | 5173 |
| Spring Boot API | 8080 |
| Python AI Service | 8000 |
| Node.js AI Service | 8001 |

---

## Key Concepts Demonstrated

- **Microservice Architecture** — independent services communicating via HTTP
- **RAG (Retrieval Augmented Generation)** — grounding LLM answers in document content
- **Vector Embeddings** — semantic text similarity using `all-MiniLM-L6-v2`
- **Spring Data JPA / Hibernate** — ORM-based database access in Java
- **Constructor Injection** — dependency injection without `@Autowired`
- **Global Exception Handling** — `@RestControllerAdvice` for clean error responses
- **Feature-based Frontend Structure** — scalable React project organization
- **Dual AI Service Pattern** — same interface, different implementations

---

## Author

**Raj Nikam**
- GitHub: [@Rajnikam7](https://github.com/Rajnikam7)
- Stack: TypeScript / JavaScript / Java / Python / AWS

---

## License

MIT License — feel free to use, fork, and build on this project.
