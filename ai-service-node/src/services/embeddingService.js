const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Groq doesn't provide embeddings — we use a simple hash-based approach
// for vector similarity using TF-IDF style term frequency vectors.
// For production, swap this with OpenAI embeddings or a local model.
const generateEmbedding = (text) => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const freq = {};

  words.forEach((word) => {
    if (word.length > 2) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  // Build a fixed-size vector from top 384 terms (matches common embedding size)
  const vocab = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 384);
  const vector = new Array(384).fill(0);

  vocab.forEach((word, i) => {
    vector[i] = freq[word] / words.length; // normalized term frequency
  });

  return vector;
};

const generateEmbeddings = (texts) => {
  return texts.map(generateEmbedding);
};

module.exports = { generateEmbedding, generateEmbeddings };
