import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowUp, RotateCw, ChevronRight, Beaker } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { Card, CardBody, CardHeader, Label } from '../components/ui/Card.jsx';
import { api } from '../api/client.js';
import { relTime, cn } from '../lib/utils.js';

const METRICS = [
  { key: 'faithfulness', label: 'Faithfulness', color: '#0EA5E9', help: 'Claims supported by retrieved context' },
  { key: 'context_precision', label: 'Context precision', color: '#10B981', help: 'Relevant chunks ranked at top' },
  { key: 'answer_relevancy', label: 'Answer relevancy', color: '#F59E0B', help: 'Answer addresses the question' },
];

export default function Evals() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvals().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div>
        <PageHeader
          eyebrow="GET /api/evals/latest"
          title="Evaluation dashboard"
          description="RAGAS metrics across the curated test set. The numbers a recruiter sees in the first three seconds."
        />
        <div className="p-8">
          <Card>
            <CardBody className="flex items-center gap-3">
              <RotateCw size={16} className="animate-spin text-ink-300" />
              <span className="text-sm text-ink-200">Loading latest run…</span>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="GET /api/evals/latest"
        title="Evaluation dashboard"
        description="RAGAS metrics across the curated test set. The numbers a recruiter sees in the first three seconds."
        action={
          <Button variant="secondary" size="sm">
            <RotateCw size={13} /> Re-run
          </Button>
        }
      />

      <div className="p-6 lg:p-8 space-y-6">
        {/* Run header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-ink-200">
            Latest run · <span className="font-mono text-ink-100">{relTime(data.last_run)}</span> ·{' '}
            <span className="font-mono text-ink-100">{data.n_test_cases} test cases</span>
          </div>
          <Badge variant="muted">
            <Beaker size={11} /> LLM-as-judge: Claude
          </Badge>
        </div>

        {/* Metric tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {METRICS.map((m) => (
            <Card key={m.key} className="grain">
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-ink-200">{m.label}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: m.color }}
                    aria-hidden="true"
                  />
                </div>
                <div className="font-display text-[40px] leading-none font-medium tracking-tight tabular mt-1">
                  {data.metrics[m.key].toFixed(2)}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-2xs text-approve font-mono">
                  <ArrowUp size={11} />
                  +{data.deltas[m.key].toFixed(2)} vs prev run
                </div>
                <div className="text-2xs text-ink-300 mt-2 leading-relaxed">{m.help}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* History chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Label>Score progression across prompt iterations</Label>
              <span className="text-2xs text-ink-300 font-mono">{data.history.length} runs</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.history}
                  margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke="#1F2A40" vertical={false} />
                  <XAxis
                    dataKey="run"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1F2A40' }}
                  />
                  <YAxis
                    domain={[0.6, 1]}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1F2A40' }}
                    tickFormatter={(v) => v.toFixed(2)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#131C2E',
                      border: '1px solid #1F2A40',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  {METRICS.map((m) => (
                    <Line
                      key={m.key}
                      type="monotone"
                      dataKey={m.key}
                      name={m.label}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={{ r: 3, fill: m.color }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-2xs text-ink-300 mt-3 font-mono leading-relaxed">
              3 prompt iterations · same 25 test cases · scored by LLM-as-judge. Run-over-run improvement reflects prompt + retrieval tuning, not model swaps.
            </p>
          </CardBody>
        </Card>

        {/* Test cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Label>Test cases ({data.test_cases.length} of {data.n_test_cases})</Label>
              <a href="#" className="text-2xs text-ink-200 hover:text-gold-500 font-mono">
                view all →
              </a>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-800">
              <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-2.5 bg-ink-900/50 text-2xs font-mono text-ink-300 uppercase tracking-widest">
                <div>Question</div>
                <div className="flex gap-6 pr-7">
                  <span className="w-10 text-center">F</span>
                  <span className="w-10 text-center">CP</span>
                  <span className="w-10 text-center">AR</span>
                </div>
              </div>
              {data.test_cases.map((tc, i) => (
                <TestCaseRow key={i} testCase={tc} />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Honest limitations footer */}
        <Card className="bg-ink-900/50">
          <CardBody>
            <Label className="mb-3">Volunteered limitations</Label>
            <ul className="text-sm text-ink-200 space-y-1.5 leading-relaxed list-disc pl-5 marker:text-ink-400">
              <li>25-question test set is small; production needs 500+ stratified across categories.</li>
              <li>RAGAS uses an LLM judge — directional rather than absolute scores; verbosity and position biases apply.</li>
              <li>Cross-encoder reranker is web-trained; financial-domain fine-tuning would lift context precision further.</li>
              <li>No conversation memory yet — each question is stateless.</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function TestCaseRow({ testCase }) {
  const { question, scores } = testCase;

  const scoreClass = (s) =>
    s >= 0.85
      ? 'text-approve bg-approve/10'
      : s >= 0.7
      ? 'text-ink-100 bg-ink-800'
      : 'text-reject bg-reject/10';

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 items-center hover:bg-ink-900/40 transition-colors group">
      <div className="text-sm text-ink-50 min-w-0 flex items-center gap-2">
        <ChevronRight size={14} className="text-ink-300 group-hover:text-gold-500 shrink-0" />
        <span className="truncate">{question}</span>
      </div>
      <div className="flex gap-2 font-mono text-2xs">
        <span className={cn('w-10 text-center py-0.5 rounded tabular', scoreClass(scores.f))}>
          {scores.f.toFixed(2)}
        </span>
        <span className={cn('w-10 text-center py-0.5 rounded tabular', scoreClass(scores.cp))}>
          {scores.cp.toFixed(2)}
        </span>
        <span className={cn('w-10 text-center py-0.5 rounded tabular', scoreClass(scores.ar))}>
          {scores.ar.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
