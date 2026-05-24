import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Bot, User, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { api } from '../api/client.js';
import { parseCitations, pct, cn, confidenceLabel } from '../lib/utils.js';

const STARTERS = [
  'What is the LTV cap for housing loans up to ₹30 lakh?',
  'Can NBFCs participate in co-lending with private banks?',
  'How is NPA classified for a personal loan with 95 days overdue?',
];

export default function Ask() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCite, setActiveCite] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function submit(q) {
    const question = (q ?? input).trim();
    if (!question || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const resp = await api.ask(question);
      setMessages((m) => [...m, { role: 'bot', ...resp }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'bot', error: e.message || 'Something went wrong' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  // The most recent bot message drives the right-rail context panel
  const lastBot = [...messages].reverse().find((m) => m.role === 'bot' && !m.error);

  return (
    <div>
      <PageHeader
        eyebrow="POST /api/ask"
        title="Compliance Q&A"
        description="Hybrid BM25 + dense retrieval over 31 RBI master directions and the bank's internal credit policy. Every claim is grounded in a source chunk."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="muted">
              <ShieldCheck size={11} /> Guardrails on
            </Badge>
            <Badge variant="muted">Hybrid · RRF · Rerank</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 p-6 lg:p-8">
        {/* Conversation column */}
        <div className="min-w-0">
          <div className="space-y-4 mb-6">
            {messages.length === 0 && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles size={18} className="text-gold-500" />
                  <h3 className="font-display text-lg font-medium">Try a question</h3>
                </div>
                <p className="text-sm text-ink-200 mb-5 leading-relaxed">
                  Ask anything from the indexed circulars or the internal credit policy. LoanLens
                  will answer with inline citations you can audit.
                </p>
                <div className="space-y-2">
                  {STARTERS.map((q) => (
                    <button
                      key={q}
                      onClick={() => submit(q)}
                      className="w-full text-left px-4 py-3 bg-ink-800 hover:bg-ink-700 rounded-md text-sm text-ink-100 transition-colors flex items-center gap-3 group"
                    >
                      <span className="font-mono text-2xs text-ink-300 group-hover:text-gold-500">
                        ⌘
                      </span>
                      {q}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                onCiteClick={setActiveCite}
                activeCite={activeCite}
              />
            ))}

            {loading && <LoadingBubble />}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="sticky bottom-6">
            <div className="bg-ink-900 border border-ink-700 rounded-lg p-3 focus-within:border-gold-500/50 transition-colors shadow-lg shadow-ink-950/50">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about a circular or internal policy…"
                rows={2}
                disabled={loading}
                className="w-full bg-transparent text-sm text-ink-50 placeholder:text-ink-300 resize-none outline-none px-2 py-1.5"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xs text-ink-300 font-mono">⏎ to send · ⇧⏎ for newline</div>
                <Button size="sm" onClick={() => submit()} disabled={loading || !input.trim()}>
                  Ask <Send size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail — retrieved context for the last answer */}
        <aside className="hidden xl:block">
          <div className="sticky top-6">
            {lastBot ? (
              <CitationRail
                message={lastBot}
                activeCite={activeCite}
                onCiteHover={setActiveCite}
              />
            ) : (
              <Card className="p-6">
                <div className="text-2xs font-mono text-ink-300 uppercase tracking-widest mb-2">
                  Retrieved context
                </div>
                <p className="text-sm text-ink-200 leading-relaxed">
                  When you ask a question, the chunks LoanLens retrieved will appear here. Cited
                  ones are highlighted so you can audit every claim.
                </p>
              </Card>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ----- Message bubbles --------------------------------------------------------

function MessageBubble({ message, onCiteClick, activeCite }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl bg-ink-800 border border-ink-700 rounded-lg px-4 py-3 flex items-start gap-3">
          <User size={14} className="text-ink-200 mt-1 shrink-0" />
          <div className="text-sm text-ink-50 leading-relaxed">{message.text}</div>
        </div>
      </div>
    );
  }

  if (message.error) {
    return (
      <Card className="border-reject/40">
        <div className="p-4 flex items-start gap-3">
          <Bot size={14} className="text-reject mt-1 shrink-0" />
          <div className="text-sm text-reject">{message.error}</div>
        </div>
      </Card>
    );
  }

  const segments = parseCitations(message.answer);
  const conf = confidenceLabel(message.confidence);

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-ink-600 flex items-center justify-center">
              <Sparkles size={12} className="text-gold-500" />
            </div>
            <span className="text-sm font-medium">LoanLens</span>
            <Badge variant="muted">grounded</Badge>
          </div>
          <div className="flex items-center gap-3 text-2xs text-ink-300 font-mono tabular">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {message.latency_ms}ms
            </span>
            <span>
              conf{' '}
              <span className={cn('font-medium', conf.color)}>
                {message.confidence?.toFixed(2)} · {conf.label}
              </span>
            </span>
          </div>
        </div>
        <div className="text-[15px] leading-[1.75] text-ink-50">
          {segments.map((s, i) =>
            s.type === 'text' ? (
              <span key={i}>{s.value}</span>
            ) : (
              <button
                key={i}
                onClick={() => onCiteClick(s.id)}
                onMouseEnter={() => onCiteClick(s.id)}
                className={cn(
                  'inline-flex items-center gap-1 mx-0.5 px-1.5 py-0 rounded text-2xs font-mono align-[2px] transition-all',
                  activeCite === s.id
                    ? 'bg-gold-500/20 text-gold-400 ring-1 ring-gold-500/50'
                    : 'bg-sky-400/10 text-sky-400 ring-1 ring-sky-400/30 hover:bg-sky-400/20'
                )}
              >
                {s.id.slice(0, 8)}
              </button>
            )
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-ink-800 flex items-center justify-between text-2xs text-ink-300">
          <span className="font-mono">
            {message.citations.length} chunks retrieved · {new Set(segments.filter(s => s.type === 'cite').map(s => s.id)).size} cited
          </span>
          <button className="text-ink-200 hover:text-ink-50 flex items-center gap-1.5 transition-colors">
            <FileText size={11} /> View raw context
          </button>
        </div>
      </div>
    </Card>
  );
}

function LoadingBubble() {
  return (
    <Card>
      <div className="p-5 flex items-center gap-3">
        <div className="w-6 h-6 rounded-md bg-ink-600 flex items-center justify-center">
          <Sparkles size={12} className="text-gold-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-3 text-sm text-ink-200">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulse" style={{ animationDelay: '120ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulse" style={{ animationDelay: '240ms' }} />
          </span>
          <span className="font-mono text-2xs text-ink-300">
            retrieving → fusing → reranking → generating
          </span>
        </div>
      </div>
    </Card>
  );
}

// ----- Citation rail ----------------------------------------------------------

function CitationRail({ message, activeCite, onCiteHover }) {
  const citedIds = new Set(
    parseCitations(message.answer)
      .filter((s) => s.type === 'cite')
      .map((s) => s.id)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xs font-mono text-ink-300 uppercase tracking-widest">
          Retrieved context
        </div>
        <span className="text-2xs text-ink-300 font-mono tabular">
          top {message.citations.length}
        </span>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        {message.citations.map((c) => {
          const cited = citedIds.has(c.chunk_id);
          const active = activeCite === c.chunk_id;
          return (
            <div
              key={c.chunk_id}
              onMouseEnter={() => onCiteHover(c.chunk_id)}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                active
                  ? 'bg-gold-500/5 border-gold-500/40'
                  : cited
                  ? 'bg-sky-400/[0.03] border-sky-400/20'
                  : 'bg-ink-900 border-ink-800'
              )}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <code
                  className={cn(
                    'text-2xs font-mono px-1.5 py-0.5 rounded',
                    active
                      ? 'bg-gold-500/15 text-gold-400'
                      : cited
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'bg-ink-800 text-ink-200'
                  )}
                >
                  {c.chunk_id.slice(0, 8)}
                </code>
                <span className="text-2xs text-ink-300 font-mono tabular">
                  score {c.score.toFixed(2)}
                </span>
              </div>
              <div className="text-2xs text-ink-300 mb-2 truncate">
                {c.doc_title}
                {c.page && ` · p. ${c.page}`}
              </div>
              <p className="text-xs text-ink-100 leading-relaxed">{c.text}</p>
              {cited && (
                <div className="mt-2 text-2xs text-sky-400 font-mono uppercase tracking-wider">
                  ↑ cited in answer
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
