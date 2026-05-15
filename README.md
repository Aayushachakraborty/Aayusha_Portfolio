# Portfolio Frontend

Standalone Vite + React SPA for the portfolio.

## Local Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `VITE_API_URL` to your local or Railway FastAPI URL.

## Deploy To Vercel

- Project root: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api.up.railway.app`
