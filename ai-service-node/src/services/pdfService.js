const fs = require('fs');
const pdfParse = require('pdf-parse');

// Extract raw text from a PDF file
const extractText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
};

// Split text into overlapping chunks — same logic as Python service
// chunk_size=500, overlap=50 so context isn't lost at boundaries
const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
};

module.exports = { extractText, chunkText };
