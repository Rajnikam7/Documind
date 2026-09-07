# DocuMind Frontend

Modern React frontend for the DocuMind AI document intelligence system.

## Features

- 📤 Drag & drop PDF upload
- 💬 Real-time chat interface
- 🎨 Beautiful gradient UI
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and lightweight

## Tech Stack

- React 18
- Vite
- CSS3 (no external UI libraries)
- Fetch API for backend communication

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 3. Make sure backend is running

- Spring Boot: `http://localhost:8080`
- FastAPI: `http://localhost:8000`

## Project Structure

```
src/
├── assets/              # Images, logos, icons
├── features/            # Feature-based modules
│   └── documents/
│       ├── FileUpload.jsx
│       ├── ChatInterface.jsx
│       └── DocumentList.jsx
├── pages/               # Page components
│   └── Home.jsx
├── lib/                 # External integrations
│   └── api.js           # API client
├── utils/               # Helper functions
│   └── formatDate.js
├── styles/              # Global styles
│   ├── App.css
│   └── index.css
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

See [STRUCTURE.md](./STRUCTURE.md) for detailed explanation.

## API Integration

All API calls go through Spring Boot (port 8080):

- `POST /documents/upload` — Upload PDF
- `GET /documents` — List all documents
- `POST /documents/{id}/ask` — Ask question about a document

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Environment Variables

If you need to change the API URL, edit `src/services/api.js`:

```js
const API_BASE_URL = 'http://localhost:8080';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers
