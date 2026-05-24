import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  TestTube,
  Bolt,
  Quote,
  Scale,
  Gauge,
  ArrowRight,
  Github,
  CircleCheckBig,
} from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';

const PROOF = [
  { n: '0.87', l: 'RAGAS faithfulness across 25 hand-built test cases' },
  { n: '0.74', l: 'AUC on Home Credit holdout, isotonic-calibrated' },
  { n: '1.8s', l: 'p50 end-to-end latency, retrieval + rerank + LLM' },
  { n: '31', l: 'RBI master directions indexed with chunk-level citations' },
];

const CAPS = [
  {
    icon: Quote,
    title: 'Answer with citations',
    body:
      'Hybrid BM25 + dense retrieval, RRF fusion, cross-encoder rerank. Every claim is pinned to a source chunk an officer can audit in one click.',
    endpoint: 'POST /api/ask',
    to: '/ask',
  },
  {
    icon: Scale,
    title: 'Decide and explain',
    body:
      'XGBoost with isotonic calibration scores applicants. SHAP attributions feed an LLM that explains decisions in plain English, grounded in policy.',
    endpoint: 'POST /api/decision',
    to: '/decisions',
  },
  {
    icon: Gauge,
    title: 'Watch its own quality',
    body:
      'RAGAS runs against a curated eval set on every change. Faithfulness, context precision, and answer relevancy tracked across iterations.',
    endpoint: 'GET /api/evals/latest',
    to: '/evals',
  },
];

const STACK = [
  'FastAPI',
  'BGE-small-en-v1.5',
  'BGE-reranker-base',
  'FAISS',
  'rank_bm25',
  'XGBoost',
  'SHAP',
  'RAGAS',
  'Anthropic Claude',
  'React · Vite',
  'Tailwind',
  'Recharts',
  'MLflow',
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-ink-800/60 sticky top-0 bg-ink-950/85 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-ink-600 flex items-center justify-center font-display text-gold-500 font-semibold">
              L
            </div>
            <div className="font-display font-medium text-[15px]">LoanLens</div>
            <Badge variant="muted" className="hidden sm:inline-flex">v0.1 · demo</Badge>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              className="hidden md:flex items-center gap-2 text-sm text-ink-200 hover:text-ink-50 transition-colors"
            >
              <Github size={16} /> Repo
            </a>
            <Link to="/ask">
              <Button size="sm">
                Open demo <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">
        {/* HERO */}
        <section className="max-w-3xl">
          <div className="flex items-center gap-2 text-2xs font-mono text-ink-300 uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-approve" />
            Portfolio case study · BFSI · GenAI
          </div>
          <h1 className="font-display text-[44px] sm:text-[52px] leading-[1.05] font-medium tracking-tight">
            A compliance copilot for retail lending that ships{' '}
            <em className="text-ink-200 font-normal">citations, not hallucinations.</em>
          </h1>
          <p className="text-base sm:text-lg text-ink-200 mt-6 leading-relaxed max-w-2xl">
            LoanLens turns 31 RBI master directions and an internal credit policy into a single
            service that answers compliance questions, scores loan applications, and explains every
            decision — with source-grounded citations a compliance officer can audit in one click.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-7">
            <Badge variant="gold">
              <Bolt size={11} /> Live demo
            </Badge>
            <Badge variant="muted">
              <Github size={11} /> Open source
            </Badge>
            <Badge variant="muted">
              <ShieldCheck size={11} /> DPDP-aware guardrails
            </Badge>
            <Badge variant="muted">
              <TestTube size={11} /> RAGAS in CI
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <Link to="/ask">
              <Button size="lg">
                Try the copilot <ArrowRight size={16} />
              </Button>
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-ink-200 hover:text-ink-50 transition-colors px-4 py-2.5"
            >
              How it works ↓
            </a>
          </div>
        </section>

        {/* PROOF BAR */}
        <section className="mt-16 border border-ink-800 rounded-lg overflow-hidden bg-ink-900 grain">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-ink-800">
            {PROOF.map((p, i) => (
              <div key={i} className="p-6 lg:p-7">
                <div className="font-display text-[34px] leading-none font-medium tracking-tight tabular">
                  {p.n}
                </div>
                <div className="text-sm text-ink-200 mt-3 leading-snug">{p.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CAPABILITIES */}
        <section id="how-it-works" className="mt-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-[28px] font-medium tracking-tight">
              What the service does
            </h2>
            <span className="text-2xs font-mono text-ink-300 uppercase tracking-widest">
              3 capabilities · 1 backend
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CAPS.map(({ icon: Icon, title, body, endpoint, to }) => (
              <Link
                key={title}
                to={to}
                className="block bg-ink-900 border border-ink-800 rounded-lg p-6 hover:border-ink-600 transition-colors group"
              >
                <div className="w-10 h-10 rounded-md bg-ink-800 flex items-center justify-center mb-5 group-hover:bg-ink-700 transition-colors">
                  <Icon size={18} className="text-gold-500" />
                </div>
                <h3 className="font-display text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-ink-200 leading-relaxed mb-4">{body}</p>
                <div className="flex items-center justify-between">
                  <code className="text-2xs font-mono text-ink-300">{endpoint}</code>
                  <ArrowRight
                    size={14}
                    className="text-ink-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="mt-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-[28px] font-medium tracking-tight">How it's wired</h2>
            <span className="text-2xs font-mono text-ink-300 uppercase tracking-widest">
              request lifecycle
            </span>
          </div>
          <div className="bg-ink-900 border border-ink-800 rounded-lg p-6 sm:p-8 grain">
            <pre className="font-mono text-[13px] leading-[2.1] text-ink-100 overflow-x-auto">
{`user query  →  guardrails  →  BM25 ∥ dense (FAISS)
                                       ↓
                              reciprocal rank fusion
                                       ↓
                              cross-encoder rerank
                                       ↓
                              citation-forced LLM
                                       ↓
                           answer + [chunk_ids] + retrieved set`}
            </pre>
            <div className="mt-7 pt-6 border-t border-ink-800">
              <div className="text-2xs font-mono text-ink-300 uppercase tracking-widest mb-4">
                Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-2xs px-2.5 py-1 bg-ink-800 text-ink-100 rounded border border-ink-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="mt-20 bg-ink-900 border border-ink-800 rounded-lg p-8 sm:p-10 grain">
          <div className="flex items-start gap-4">
            <CircleCheckBig size={24} className="text-gold-500 mt-1 shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-medium mb-3">The pitch in one breath</h3>
              <p className="text-base text-ink-200 leading-relaxed max-w-3xl">
                Compliance teams won't accept LLMs that can't cite their sources. LoanLens is the
                proof-of-concept for an LLM service that can — wrapped around a calibrated credit
                model, watched by a RAGAS harness, and built with the production patterns a real
                bank would actually deploy.
              </p>
              <div className="mt-6">
                <Link to="/ask">
                  <Button size="lg">
                    Open the live demo <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-14 pb-6 flex flex-wrap items-center justify-between gap-4 text-2xs text-ink-300">
          <div>© 2026 LoanLens demo · portfolio case study</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-ink-50 transition-colors">
              Loom walkthrough
            </a>
            <a href="#" className="hover:text-ink-50 transition-colors">
              Architecture diagram
            </a>
            <a href="#" className="hover:text-ink-50 transition-colors">
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
