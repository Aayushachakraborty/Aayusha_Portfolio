/**
 * API client abstraction.
 *
 * In demo mode (default), returns rich mock data so the UI is fully demoable
 * without a backend running. Once the FastAPI service is up, set
 * VITE_USE_REAL_API=true in .env to flip to real HTTP calls.
 *
 * This mirrors the DataNirnaya pattern: UI never imports mocks directly,
 * always goes through this client. Swapping backend = changing one flag.
 */

import { mockAsk, mockDecide, mockEvals, mockSampleApplicants } from './mocks.js';

const USE_REAL = import.meta.env.VITE_USE_REAL_API === 'true';
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function realFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  async ask(question, opts = {}) {
    if (USE_REAL) {
      return realFetch('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ question, top_k: 5, rerank: true, ...opts }),
      });
    }
    await delay(900); // simulate retrieval + rerank + LLM latency
    return mockAsk(question);
  },

  async decide(applicant) {
    if (USE_REAL) {
      return realFetch('/api/decision', {
        method: 'POST',
        body: JSON.stringify(applicant),
      });
    }
    await delay(700);
    return mockDecide(applicant);
  },

  async getEvals() {
    if (USE_REAL) return realFetch('/api/evals/latest');
    await delay(250);
    return mockEvals();
  },

  sampleApplicants() {
    return mockSampleApplicants();
  },
};
