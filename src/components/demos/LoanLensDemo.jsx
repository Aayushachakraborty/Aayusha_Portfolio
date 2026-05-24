import { useMemo, useState } from 'react';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

const questions = [
  {
    label: 'LTV cap',
    prompt: 'What is the LTV cap for housing loans up to INR 30 lakh?',
    answer: 'Housing loans up to INR 30 lakh are capped at 90% LTV. Internal credit policy adds stricter CIBIL overlays for higher brackets.',
    confidence: '0.87',
    latency: '1.7s',
    citations: '3 chunks',
  },
  {
    label: 'Co-lending',
    prompt: 'Can NBFCs participate in co-lending with private banks?',
    answer: 'Yes. Co-lending is permitted for priority sector loans, with the bank taking its share on book and retaining at least 20%.',
    confidence: '0.81',
    latency: '1.9s',
    citations: '2 chunks',
  },
  {
    label: 'NPA',
    prompt: 'How is NPA classified for a personal loan with 95 days overdue?',
    answer: 'A loan becomes NPA when principal or interest is overdue for more than 90 days, then moves through substandard, doubtful, and loss classes.',
    confidence: '0.91',
    latency: '1.4s',
    citations: '1 chunk',
  },
];

const applicantRows = [
  { factor: 'External score 2', direction: 'decreases risk', shap: '-0.20' },
  { factor: 'Employment tenure', direction: 'decreases risk', shap: '-0.34' },
  { factor: 'Loan amount', direction: 'increases risk', shap: '+0.18' },
];

export default function LoanLensDemo() {
  const [active, setActive] = useState(questions[0]);
  const [decision, setDecision] = useState('REVIEW');
  const decisionMeta = useMemo(() => {
    if (decision === 'APPROVED') return { probability: '22%', note: 'Strong bureau signals and stable employment.' };
    if (decision === 'REJECTED') return { probability: '68%', note: 'High debt burden and weak external scores.' };
    return { probability: '43%', note: 'Borderline score routed for manual officer review.' };
  }, [decision]);

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>LoanLens Compliance Cockpit</h3>
        <p>
          A compact version of the LoanLens product flow: ask a lending policy question, review the
          cited answer, then inspect a SHAP-grounded credit decision.
        </p>
      </div>

      <div className="control-grid">
        {questions.map((item) => (
          <button
            className="demo-button"
            type="button"
            key={item.label}
            onClick={() => setActive(item)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="demo-grid">
        <MetricTile label="Faithfulness" value="0.87" />
        <MetricTile label="Context precision" value="0.83" />
        <MetricTile label="AUC holdout" value="0.74" />
      </div>

      <div className="pipeline-list">
        <div className="pipeline-step">
          <span>Q</span>
          <strong>{active.prompt}</strong>
        </div>
        <div className="pipeline-step">
          <span>A</span>
          <strong>{active.answer}</strong>
        </div>
        <div className="pipeline-step">
          <span>C</span>
          <strong>{active.citations} cited with confidence {active.confidence} in {active.latency}</strong>
        </div>
      </div>

      <div className="control-grid">
        {['APPROVED', 'REVIEW', 'REJECTED'].map((item) => (
          <button
            className="demo-button"
            type="button"
            key={item}
            onClick={() => setDecision(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="demo-grid">
        <MetricTile label="Decision" value={decision} />
        <MetricTile label="Default probability" value={decisionMeta.probability} />
        <MetricTile label="Explanation" value="SHAP" />
      </div>
      <p>{decisionMeta.note}</p>

      <ModelTable
        columns={[
          { key: 'factor', label: 'Factor' },
          { key: 'direction', label: 'Direction' },
          { key: 'shap', label: 'SHAP' },
        ]}
        rows={applicantRows}
      />
    </div>
  );
}
