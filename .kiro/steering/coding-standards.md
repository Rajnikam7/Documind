---
inclusion: always
---

# Coding Standards

## Response Style
- Code only by default — no explanations unless asked
- No summaries, no restating the question, no theory
- Short bullets over paragraphs
- If explanation needed: max 2-3 lines

## Comments
- Only where logic is genuinely non-obvious or critical
- No section divider comments, no self-explanatory comments

## Code Style
- ES6 modules (`import`/`export`)
- `camelCase` variables/functions, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- Joi validation, feature-scoped (`auth.validation.js`, `property.validation.js`)
- `async/await` with try/catch in controllers
- **Avoid inline styles** — use CSS modules/SCSS classes instead. Only use inline styles for truly dynamic values (e.g., `width: ${percentage}%`) or third-party library requirements

## Response Format
```js
// success
{ success: true, message: "...", data: {} }
// error
{ success: false, message: "..." }
```

## Response Data Rules
- Never send: `createdAt`, `updatedAt`, `__v`, `lastLoginAt`, `refreshToken`, `password`, `otp` unless explicitly required
- Always `.select()` only fields frontend needs
- When in doubt, send less

## Project Structure
- `src/controllers/` — request/response only
- `src/models/` — Mongoose schemas
- `src/routes/` — route definitions
- `src/middlewares/` — middleware
- `src/utils/` — helpers, validation (feature-scoped)
- `src/services/` — business logic
- `src/db/` — DB connection and constants
