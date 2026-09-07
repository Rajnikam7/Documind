from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.embeddings.base import Embeddings
from sentence_transformers import SentenceTransformer
from typing import List

load_dotenv()

app = FastAPI()

# Direct sentence-transformers usage — bypasses LangChain wrapper issues
class LocalEmbeddings(Embeddings):
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        texts = [t for t in texts if t.strip()]
        if not texts:
            raise ValueError("No valid text for embedding")
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text: str) -> List[float]:
        return self.model.encode([text], convert_to_numpy=True)[0].tolist()

embedding = LocalEmbeddings()

# ChromaDB — persists vectors to ./db folder
db = Chroma(persist_directory="db", embedding_function=embedding)

# Groq setup — free tier, no billing needed
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ProcessRequest(BaseModel):
    file_path: str
    document_id: str


class AskRequest(BaseModel):
    question: str
    document_id: str  # filter answers to a specific document


@app.post("/process-document")
def process_document(data: ProcessRequest):
    if not os.path.exists(data.file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {data.file_path}")

    # 1. Extract text from PDF
    loader = PyPDFLoader(data.file_path)
    pages = loader.load()

    # 2. Split into chunks (500 chars, 50 overlap so context isn't lost at boundaries)
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(pages)

    # 3. Filter empty chunks + tag with document_id
    chunks = [c for c in chunks if c.page_content.strip()]
    for chunk in chunks:
        chunk.metadata["document_id"] = data.document_id

    print("Total pages:", len(pages))
    print("Total chunks:", len(chunks))
    print("First chunk:", chunks[0].page_content[:100] if chunks else "NO TEXT")

    if not chunks:
        raise HTTPException(status_code=400, detail="No valid text found in PDF — may be a scanned/image PDF")

    # 4. Store embeddings in ChromaDB
    db.add_documents(chunks)

    print(f"[AI] Stored {len(chunks)} chunks for doc_id={data.document_id}")
    return {"success": True, "chunks": len(chunks), "document_id": data.document_id}


@app.post("/ask")
def ask_question(data: AskRequest):
    # Find top 3 most relevant chunks for this question, filtered by document
    results = db.similarity_search(
        data.question,
        k=3,
        filter={"document_id": data.document_id}
    )

    if not results:
        raise HTTPException(status_code=404, detail="No content found for this document")

    # Build context from retrieved chunks
    context = "\n\n".join([doc.page_content for doc in results])

    prompt = f"""Answer ONLY based on the context below. If the answer is not in the context, say "I don't know".

Context:
{context}

Question:
{data.question}"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Answer ONLY based on the provided context. If the answer is not in the context, say 'I don't know'."},
            {"role": "user", "content": prompt}
        ]
    )
    return {"answer": response.choices[0].message.content, "document_id": data.document_id}


@app.get("/health")
def health():
    return {"status": "ok"}
