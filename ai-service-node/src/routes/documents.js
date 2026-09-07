const express = require('express');
const router = express.Router();
const { extractText, chunkText } = require('../services/pdfService');
const { storeChunks, similaritySearch } = require('../services/vectorService');
const { askGroq } = require('../services/llmService');
const fs = require('fs');

// POST /process-document
// Called by Spring Boot after file upload — same contract as Python service
router.post('/process-document', async (req, res) => {
  const { file_path, document_id } = req.body;

  if (!file_path || !document_id) {
    return res.status(400).json({ success: false, message: 'file_path and document_id are required' });
  }

  if (!fs.existsSync(file_path)) {
    return res.status(404).json({ success: false, message: `File not found: ${file_path}` });
  }

  try {
    // 1. Extract text from PDF
    const text = await extractText(file_path);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'No text found in PDF — may be a scanned/image PDF' });
    }

    // 2. Split into chunks
    const chunks = chunkText(text);
    console.log(`[Node AI] doc_id=${document_id} → ${chunks.length} chunks`);

    // 3. Store in ChromaDB
    await storeChunks(chunks, document_id);

    res.json({ success: true, chunks: chunks.length, document_id });
  } catch (err) {
    console.error('[Node AI] process-document error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /ask
// Called by Spring Boot when user asks a question
router.post('/ask', async (req, res) => {
  const { question, document_id } = req.body;

  if (!question || !document_id) {
    return res.status(400).json({ success: false, message: 'question and document_id are required' });
  }

  try {
    // 1. Find relevant chunks
    const chunks = await similaritySearch(question, document_id);

    if (!chunks.length) {
      return res.status(404).json({ success: false, message: 'No content found for this document' });
    }

    const context = chunks.join('\n\n');

    // 2. Ask Groq LLM
    const answer = await askGroq(context, question);

    res.json({ answer, document_id });
  } catch (err) {
    console.error('[Node AI] ask error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-service-node' });
});

module.exports = router;
