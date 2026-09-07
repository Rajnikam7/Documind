# Frontend Structure

Following industry-standard React project organization.

```
documind-frontend/
├── public/
│   └── (static assets)
│
├── src/
│   ├── assets/              # Images, logos, icons
│   │
│   ├── features/            # Feature-based modules
│   │   └── documents/
│   │       ├── FileUpload.jsx
│   │       ├── FileUpload.css
│   │       ├── ChatInterface.jsx
│   │       ├── ChatInterface.css
│   │       ├── DocumentList.jsx
│   │       └── DocumentList.css
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   └── Home.css
│   │
│   ├── lib/                 # External integrations
│   │   └── api.js           # API client
│   │
│   ├── utils/               # Helper functions
│   │   └── formatDate.js
│   │
│   ├── styles/              # Global styles
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
│
├── .kiro/
│   └── steering/
│       └── new-feature.md   # Structure template
│
├── index.html
├── vite.config.js
├── package.json
├── README.md
├── QUICKSTART.md
└── STRUCTURE.md
```

## Folder Purposes

### `/features`
Feature-based organization. Each feature is self-contained with its components and styles.

**Example:** `features/documents/` contains all document-related UI components.

### `/pages`
Top-level page components that compose features together.

**Example:** `Home.jsx` uses FileUpload, ChatInterface, and DocumentList.

### `/lib`
External service integrations and clients.

**Example:** `api.js` handles all HTTP requests to Spring Boot backend.

### `/utils`
Pure utility functions used across the app.

**Example:** `formatDate.js` for date formatting.

### `/styles`
Global CSS files.

**Example:** `App.css` for app-wide layout, `index.css` for resets.

### `/assets`
Static files like images, logos, fonts.

## Why This Structure?

✅ **Scalable** — Easy to add new features without cluttering
✅ **Maintainable** — Related code stays together
✅ **Testable** — Each feature can be tested independently
✅ **Industry Standard** — Follows React best practices

## Adding a New Feature

1. Create folder in `src/features/your-feature/`
2. Add components with their CSS
3. Export from feature folder
4. Import in pages as needed

Example:
```
src/features/auth/
├── LoginForm.jsx
├── LoginForm.css
├── SignupForm.jsx
└── SignupForm.css
```

Then use in `pages/Login.jsx`:
```jsx
import LoginForm from '../features/auth/LoginForm';
```
