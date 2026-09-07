# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Spring Boot backend running on port 8080
- FastAPI service running on port 8000

## Steps

### 1. Install dependencies

```bash
cd documind-frontend
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Open in browser

Navigate to: `http://localhost:5173`

## Usage

### Upload a Document

1. Drag & drop a PDF file onto the upload zone, or click to browse
2. Wait for the upload and processing to complete
3. The chat interface will appear automatically

### Ask Questions

1. Type your question in the input field at the bottom
2. Press Enter or click the send button
3. Wait for the AI to analyze and respond
4. Continue the conversation with follow-up questions

### Start Over

Click the "New Document" button to upload a different PDF

## Troubleshooting

### CORS errors

Make sure Spring Boot has CORS enabled for `http://localhost:5173`

### Upload fails

- Check that Spring Boot is running on port 8080
- Check that the PDF is a valid text-based PDF (not scanned)
- Check browser console for error messages

### No answer from AI

- Check that FastAPI is running on port 8000
- Check that Groq API key is set in `ai-service/.env`
- Check FastAPI terminal for error logs

## Features

✅ Drag & drop upload
✅ Real-time chat
✅ Recent documents list
✅ Mobile responsive
✅ Beautiful gradient UI
✅ Loading states
✅ Error handling
