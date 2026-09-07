# AI Service — Node.js

Node.js AI microservice for DocuMind. Runs on port 8001.
Same contract as the Python service (port 8000).

## Stack

- Express.js — HTTP server
- pdf-parse — PDF text extraction
- chromadb — vector storage
- groq-sdk — LLM (Llama 3.3 70B)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Edit `.env`:

```
PORT=8001
GROQ_API_KEY=your_groq_key_here
```

Get your free Groq key at: https://console.groq.com/keys

### 3. Start ChromaDB server

The Node service connects to ChromaDB via HTTP (port 8002).
Start it with:

```bash
pip install chromadb
chroma run --port 8002
```

### 4. Start the service

```bash
npm run dev
```

The service will run on `http://localhost:8001`

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/process-document` | Process a PDF and store embeddings |
| POST | `/ask` | Ask a question about a document |
| GET | `/health` | Health check |

## Request Contracts

### POST /process-document
```json
{
  "file_path": "D:/absolute/path/to/file.pdf",
  "document_id": "10"
}
```

### POST /ask
```json
{
  "question": "What is this document about?",
  "document_id": "10"
}
```

## Port Summary

| Service | Port |
|---------|------|
| Spring Boot | 8080 |
| Python AI | 8000 |
| Node AI | 8001 |
| ChromaDB (for Node) | 8002 |
| React Frontend | 5173 |
