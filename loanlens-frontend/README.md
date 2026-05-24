# LoanLens Frontend

React + Vite + Tailwind UI for the LoanLens compliance copilot.

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. The mock API layer ships with realistic responses for the demo — no backend needed.

## Wire up the real backend

```bash
cp .env.example .env
# edit .env: set VITE_USE_REAL_API=true
npm run dev
```

The UI now hits `http://localhost:8000/api/*` (FastAPI). Mock layer stays in the code as fallback for offline demos.

## Project structure

```
src/
├── api/
│   ├── client.js     ← single point of contact with backend
│   └── mocks.js      ← demo data
├── components/
│   ├── layout/       ← AppShell, PageHeader
│   └── ui/           ← Card, Button, Badge
├── lib/
│   └── utils.js      ← formatting, citation parsing
├── pages/
│   ├── Landing.jsx   ← service positioning, /
│   ├── Ask.jsx       ← RAG Q&A, /ask
│   ├── Decisions.jsx ← credit decisions, /decisions
│   └── Evals.jsx     ← RAGAS dashboard, /evals
├── App.jsx           ← router
└── main.jsx          ← entry
```

## Design tokens

The whole palette lives in `tailwind.config.js`. Anything BFSI-themed pulls from `ink` (navy) and `gold`; semantic decisions use `approve`, `reject`, `review`. Typography pairs Fraunces (display serif) with Inter (body) and JetBrains Mono (numbers, IDs, code).

## Building for production

```bash
npm run build
# outputs to dist/ — deploy to Vercel/Netlify/Cloudflare Pages
```

When you deploy, set `VITE_API_BASE` to your hosted FastAPI URL and `VITE_USE_REAL_API=true`.
