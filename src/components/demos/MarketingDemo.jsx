import { useState } from 'react';
import DriverBar from '../shared/DriverBar';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

export default function MarketingDemo({ type = 'attribution' }) {
  const [search, setSearch] = useState(35);
  const [social, setSocial] = useState(25);
  const [retargeting, setRetargeting] = useState(20);
  const total = search + social + retargeting;
  const roas = ((search * 4.1 + social * 2.7 + retargeting * 5.2) / Math.max(total, 1)).toFixed(1);
  const winner = retargeting >= search && retargeting >= social ? 'Retargeting' : search >= social ? 'Search' : 'Social';
  const rows = [
    { id: 'search', channel: 'Search', spend: `${search}%`, roas: '4.1x', contribution: `${Math.round(search * 1.3)}%` },
    { id: 'social', channel: 'Social', spend: `${social}%`, roas: '2.7x', contribution: `${Math.round(social * 0.8)}%` },
    { id: 'retargeting', channel: 'Retargeting', spend: `${retargeting}%`, roas: '5.2x', contribution: `${Math.round(retargeting * 1.6)}%` },
  ];
  const efficiency = Math.round(Number(roas) * 21);

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>{type === 'mmm' ? 'MMM Budget Optimizer' : 'Marketing Attribution Command Center'}</h3>
        <p>{type === 'mmm' ? 'Estimate channel contribution after adstock and saturation, then reallocate budget to the next best rupee.' : 'Read CAC, LTV, ROAS, and payback together so channel decisions do not overfit last-click noise.'}</p>
      </div>
      <div className="control-grid">
        <label>Search {search}%<input type="range" min="0" max="70" value={search} onChange={(event) => setSearch(Number(event.target.value))} /></label>
        <label>Social {social}%<input type="range" min="0" max="70" value={social} onChange={(event) => setSocial(Number(event.target.value))} /></label>
        <label>Retargeting {retargeting}%<input type="range" min="0" max="70" value={retargeting} onChange={(event) => setRetargeting(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Blended ROAS" value={`${roas}x`} />
        <MetricTile label="Best channel" value={winner} />
        <MetricTile label="Efficiency score" value={`${efficiency}`} />
        <MetricTile label="Next move" value={type === 'mmm' ? 'Shift budget' : 'Review cohort'} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'channel', label: 'Channel' },
            { key: 'spend', label: 'Spend' },
            { key: 'roas', label: 'ROAS' },
            { key: 'contribution', label: 'Contribution' },
          ]}
          rows={rows}
        />
        <div className="driver-stack">
          <DriverBar label={type === 'mmm' ? 'Adstock carryover' : 'LTV quality'} value={type === 'mmm' ? 2.1 : 1.8} />
          <DriverBar label={type === 'mmm' ? 'Saturation penalty' : 'Payback speed'} value={type === 'mmm' ? -1.2 : 1.3} />
          <DriverBar label="Incremental lift" value={Number(roas) - 2.8} tone="gold" />
        </div>
      </div>
    </div>
  );
}
