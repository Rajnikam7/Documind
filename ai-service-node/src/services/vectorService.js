const { ChromaClient } = require('chromadb');
const { generateEmbedding, generateEmbeddings } = require('./embeddingService');

// ChromaDB client — connects to the same ChromaDB instance as Python service
// but uses a separate collection so they don't interfere
const client = new ChromaClient({ path: 'http://localhost:8002' });
const COLLECTION_NAME = 'documind_node';

let collection;

const getCollection = async () => {
  if (!collection) {
    collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { 'hnsw:space': 'cosine' },
    });
  }
  return collection;
};

// Store document chunks with embeddings in ChromaDB
const storeChunks = async (chunks, documentId) => {
  const col = await getCollection();

  const embeddings = generateEmbeddings(chunks);
  const ids = chunks.map((_, i) => `doc_${documentId}_chunk_${i}`);
  const metadatas = chunks.map(() => ({ document_id: documentId }));

  await col.upsert({ ids, embeddings, documents: chunks, metadatas });
};

// Find top-k most similar chunks for a question, filtered by document
const similaritySearch = async (question, documentId, k = 3) => {
  const col = await getCollection();
  const queryEmbedding = generateEmbedding(question);

  const results = await col.query({
    queryEmbeddings: [queryEmbedding],
    nResults: k,
    where: { document_id: documentId },
  });

  return results.documents[0] || [];
};

module.exports = { storeChunks, similaritySearch };
