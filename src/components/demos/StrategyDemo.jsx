import { useState } from 'react';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

export default function StrategyDemo() {
  const [growth, setGrowth] = useState(12);
  const [inventory, setInventory] = useState(18);
  const [hiring, setHiring] = useState(8);
  const finance = Math.round(68 + growth * 0.3 - hiring * 0.8);
  const procurement = Math.round(54 + inventory * 1.1 - growth * 0.25);
  const sales = Math.round(62 + growth * 0.95 - inventory * 0.15);
  const ops = Math.round(70 + inventory * 0.35 - hiring * 0.2);
  const score = Math.round((finance + procurement + sales + ops) / 4);
  const risk = Math.max(8, Math.round(50 - inventory * 0.55 + growth * 0.45 + hiring * 0.18));
  const agents = [
    { id: 'fin', name: 'Finance Agent', signal: `${finance}%`, action: finance > 72 ? 'Approve growth budget' : 'Cap burn rate' },
    { id: 'proc', name: 'Procurement Agent', signal: `${procurement}%`, action: procurement > 70 ? 'Forward buy inventory' : 'Delay purchase' },
    { id: 'sales', name: 'Sales Agent', signal: `${sales}%`, action: sales > 76 ? 'Expand campaign' : 'Target high-LTV segment' },
    { id: 'ops', name: 'Ops Agent', signal: `${ops}%`, action: ops > 74 ? 'Maintain SLA' : 'Reduce complexity' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Multi-Agent Strategy War Room</h3>
        <p>Each agent optimizes a different business objective. The final recommendation is a negotiated operating plan, not a single black-box score.</p>
      </div>
      <div className="control-grid">
        <label>Growth push {growth}%<input type="range" min="0" max="30" value={growth} onChange={(event) => setGrowth(Number(event.target.value))} /></label>
        <label>Inventory buffer {inventory}%<input type="range" min="0" max="40" value={inventory} onChange={(event) => setInventory(Number(event.target.value))} /></label>
        <label>Hiring intensity {hiring}%<input type="range" min="0" max="20" value={hiring} onChange={(event) => setHiring(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Decision confidence" value={`${Math.min(score, 96)}%`} />
        <MetricTile label="Operating risk" value={`${risk}%`} />
        <MetricTile label="Recommended move" value={risk > 35 ? 'Protect margin' : 'Scale plan'} />
      </div>
      <ModelTable
        columns={[
          { key: 'name', label: 'Agent' },
          { key: 'signal', label: 'Signal' },
          { key: 'action', label: 'Action' },
        ]}
        rows={agents}
      />
    </div>
  );
}
