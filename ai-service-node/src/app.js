require('dotenv').config();
const express = require('express');
const documentsRouter = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());

// Mount all document routes at root level — same contract as Python service
app.use('/', documentsRouter);

app.listen(PORT, () => {
  console.log(`[Node AI Service] Running on http://localhost:${PORT}`);
});
