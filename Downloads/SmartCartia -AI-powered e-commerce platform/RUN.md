Run locally

- Prereqs: Node 18+, npm
- Install deps and start both servers:

```
npm install
npm run dev
```

- URLs:
  - Frontend: http://localhost:3000
  - Backend:  http://localhost:3001

Environment

- Create `.env.local` at repo root (already added in this repo):

```
FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Gemini
GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-2.0-flash
PYTHON_EXECUTABLE=python
PYTHON_ML_PATH=./ml
```

API quick tests

PowerShell:

```
Invoke-RestMethod -Method Get http://localhost:3001/api/health

$body = '{"query":"budget wireless earbuds under 5k"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/find-my-product -ContentType 'application/json' -Body $body
```

Notes

- All frontend fetches go through backend: base `http://localhost:3001/api/*`.
- Gemini key is server-side only. Do not expose it in frontend.