import { useState } from 'react';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

export default function ReportingDemo() {
  const [generated, setGenerated] = useState(false);
  const [freshness, setFreshness] = useState(92);
  const sections = generated
    ? ['Revenue variance explained', 'Supplier delay risk flagged', 'SKU margin summary written', 'Executive action list ready']
    : ['Ingest ERP extract', 'Run SQL transforms', 'Score delay risk', 'Generate narrative'];
  const reportRows = [
    { id: 'rev', section: 'Revenue', status: generated ? 'Written' : 'Waiting', owner: 'Finance' },
    { id: 'ops', section: 'Operations', status: generated ? 'Risk flagged' : 'Queued', owner: 'Ops' },
    { id: 'sku', section: 'SKU margin', status: generated ? 'Complete' : 'Queued', owner: 'Merch' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Generative BI Pipeline Control Room</h3>
        <p>A data product for recurring executive reporting: lineage, data freshness, predictive flags, and generated business narrative.</p>
      </div>
      <div className="control-grid">
        <label>Data freshness {freshness}%<input type="range" min="50" max="100" value={freshness} onChange={(event) => setFreshness(Number(event.target.value))} /></label>
        <button className="demo-button" type="button" onClick={() => setGenerated(!generated)}>
          {generated ? 'Reset pipeline' : 'Generate report'}
        </button>
      </div>
      <div className="demo-grid">
        <MetricTile label="Data quality" value={`${freshness}%`} />
        <MetricTile label="Delay risk model" value={generated ? 'Scored' : 'Ready'} />
        <MetricTile label="Narrative status" value={generated ? 'Published' : 'Draft'} />
      </div>
      <div className="pipeline-list">
        {sections.map((item, index) => (
          <div className="pipeline-step" key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <ModelTable
        columns={[
          { key: 'section', label: 'Section' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
        ]}
        rows={reportRows}
      />
    </div>
  );
}
