import { useState } from 'react';
import {
  CircleCheck,
  CircleAlert,
  CircleX,
  Sparkles,
  RotateCw,
  FileText,
  Scale,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { Card, CardHeader, CardBody, Label } from '../components/ui/Card.jsx';
import { api } from '../api/client.js';
import { inr, pct, cn } from '../lib/utils.js';

const SAMPLES = api.sampleApplicants();

const FIELDS = [
  { key: 'AMT_INCOME_TOTAL', label: 'Annual income', format: 'inr' },
  { key: 'AMT_CREDIT', label: 'Loan amount', format: 'inr' },
  { key: 'AMT_ANNUITY', label: 'Annual EMI', format: 'inr' },
  { key: 'DAYS_BIRTH', label: 'Age (years)', transform: (v) => `${Math.round(-v / 365)} yrs` },
  {
    key: 'DAYS_EMPLOYED',
    label: 'Employment tenure',
    transform: (v) => `${(Math.abs(v) / 365).toFixed(1)} yrs`,
  },
  { key: 'EXT_SOURCE_1', label: 'External score 1' },
  { key: 'EXT_SOURCE_2', label: 'External score 2' },
  { key: 'EXT_SOURCE_3', label: 'External score 3' },
  { key: 'CNT_FAM_MEMBERS', label: 'Family size' },
  { key: 'FLAG_OWN_REALTY', label: 'Owns property', transform: (v) => (v ? 'Yes' : 'No') },
];

export default function Decisions() {
  const [applicant, setApplicant] = useState(SAMPLES[0].profile);
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);

  async function decide() {
    setLoading(true);
    try {
      const result = await api.decide(applicant);
      setDecision(result);
    } finally {
      setLoading(false);
    }
  }

  function loadSample(sample) {
    setApplicant(sample.profile);
    setDecision(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="POST /api/decision"
        title="Credit decisioning"
        description="XGBoost with isotonic calibration scores the applicant. SHAP attributions feed an LLM that explains the decision in plain English."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="muted">AUC 0.74 · calibrated</Badge>
            <Badge variant="muted">SHAP-grounded</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8">
        {/* Applicant form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Label>Applicant profile</Label>
              <div className="flex items-center gap-1.5">
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => loadSample(s)}
                    className="text-2xs font-mono px-2 py-1 rounded bg-ink-800 hover:bg-ink-700 text-ink-200 hover:text-ink-50 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-800">
              {FIELDS.map((f) => {
                const v = applicant[f.key];
                let displayed;
                if (f.transform) displayed = f.transform(v);
                else if (f.format === 'inr') displayed = inr(v);
                else displayed = typeof v === 'number' ? v.toFixed(2) : v;
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <div className="text-sm text-ink-50">{f.label}</div>
                      <div className="text-2xs font-mono text-ink-300 mt-0.5">{f.key}</div>
                    </div>
                    <div className="text-sm font-medium tabular">{displayed}</div>
                  </div>
                );
              })}
            </div>
            <div className="p-5 border-t border-ink-800 flex items-center justify-between">
              <div className="text-2xs text-ink-300 font-mono">
                Loaded sample · {Object.keys(applicant).length} features
              </div>
              <Button onClick={decide} disabled={loading}>
                {loading ? (
                  <>
                    <RotateCw size={14} className="animate-spin" /> Deciding…
                  </>
                ) : (
                  <>
                    Decide <Scale size={14} />
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Decision panel */}
        {decision ? (
          <DecisionPanel decision={decision} />
        ) : (
          <Card className="grain">
            <CardBody className="flex flex-col items-center justify-center min-h-[400px] text-center p-10">
              <div className="w-12 h-12 rounded-lg bg-ink-800 flex items-center justify-center mb-5">
                <Scale size={20} className="text-ink-300" />
              </div>
              <h3 className="font-display text-lg font-medium mb-2">No decision yet</h3>
              <p className="text-sm text-ink-200 max-w-sm leading-relaxed">
                Load a sample applicant or edit the profile, then click <em>Decide</em> to score
                the application and see the SHAP-grounded explanation.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

// ----- Decision panel ---------------------------------------------------------

const DECISION_META = {
  APPROVED: {
    label: 'Approved',
    icon: CircleCheck,
    color: 'text-approve',
    bgColor: 'bg-approve/10',
    borderColor: 'border-approve/30',
    badge: 'approve',
  },
  REVIEW: {
    label: 'Manual review',
    icon: CircleAlert,
    color: 'text-review',
    bgColor: 'bg-review/10',
    borderColor: 'border-review/30',
    badge: 'review',
  },
  REJECTED: {
    label: 'Rejected',
    icon: CircleX,
    color: 'text-reject',
    bgColor: 'bg-reject/10',
    borderColor: 'border-reject/30',
    badge: 'reject',
  },
};

function DecisionPanel({ decision }) {
  const meta = DECISION_META[decision.decision];
  const Icon = meta.icon;

  // Probability gauge: visual scale 0–100, with markers at 30% (approve cap) and 60% (reject floor)
  const fill = decision.probability * 100;

  return (
    <Card className={cn('border', meta.borderColor)}>
      <div className={cn('p-6 border-b border-ink-800', meta.bgColor)}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Icon size={24} className={meta.color} />
            <h3 className="font-display text-xl font-medium">{meta.label}</h3>
          </div>
          <Badge variant={meta.badge}>
            default prob {pct(decision.probability)}
          </Badge>
        </div>

        {/* Probability gauge */}
        <div className="relative">
          <div className="h-2 bg-ink-800 rounded-full overflow-hidden relative">
            <div
              className={cn(
                'h-full transition-all duration-700 ease-out',
                decision.decision === 'APPROVED' && 'bg-approve',
                decision.decision === 'REVIEW' && 'bg-review',
                decision.decision === 'REJECTED' && 'bg-reject'
              )}
              style={{ width: `${fill}%` }}
            />
            {/* threshold markers */}
            <div
              className="absolute top-0 bottom-0 w-px bg-ink-100/40"
              style={{ left: '30%' }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-ink-100/40"
              style={{ left: '60%' }}
            />
          </div>
          <div className="flex justify-between text-2xs text-ink-300 font-mono mt-2 tabular">
            <span>0%</span>
            <span style={{ marginLeft: '-12px' }}>approve &lt; 30%</span>
            <span style={{ marginLeft: '12px' }}>reject &gt; 60%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* SHAP attributions */}
      <CardBody>
        <Label className="mb-4">Top SHAP factors</Label>
        <div className="space-y-2.5">
          {decision.top_factors.map((f) => (
            <ShapBar key={f.feature} factor={f} />
          ))}
        </div>

        <div className="mt-5 text-2xs text-ink-300 font-mono leading-relaxed">
          ← decreases risk · increases risk →
        </div>

        {/* LLM explanation */}
        <div className="mt-6 pt-6 border-t border-ink-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded bg-ink-700 flex items-center justify-center">
              <Sparkles size={11} className="text-gold-500" />
            </div>
            <Label>Customer-facing explanation</Label>
          </div>
          <p className="text-sm leading-[1.75] text-ink-50">{decision.explanation}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-ink-800 flex items-center justify-between">
          <div className="text-2xs text-ink-300 font-mono">
            Decision logged · model v0.1
          </div>
          <button className="text-2xs text-ink-200 hover:text-gold-500 flex items-center gap-1.5 transition-colors font-mono">
            <FileText size={11} /> Policy citations for this decision
          </button>
        </div>
      </CardBody>
    </Card>
  );
}

function ShapBar({ factor }) {
  const max = 0.5; // SHAP-value scale
  const isPositive = factor.shap_value > 0;
  const width = Math.min(50, (Math.abs(factor.shap_value) / max) * 50);

  return (
    <div className="grid grid-cols-[140px_1fr_60px] gap-3 items-center text-xs">
      <div className="text-right font-mono text-ink-200 truncate">{factor.feature}</div>
      <div className="relative h-5 bg-ink-800/40 rounded">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink-700" />
        <div
          className={cn(
            'absolute top-0.5 bottom-0.5 rounded-sm transition-all duration-700',
            isPositive ? 'bg-reject left-1/2' : 'bg-approve right-1/2'
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="font-mono tabular text-ink-100">
        {isPositive ? '+' : '−'}
        {Math.abs(factor.shap_value).toFixed(2)}
      </div>
    </div>
  );
}
