import { useState } from 'react';
import DriverBar from '../shared/DriverBar';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

export default function SupplyChainDemo() {
  const [leadTime, setLeadTime] = useState(14);
  const [variance, setVariance] = useState(22);
  const [risk, setRisk] = useState(35);
  const disruption = Math.min(94, Math.round(leadTime * 1.7 + variance * 0.55 + risk * 0.8));
  const suppliers = [
    { id: 's1', supplier: 'Supplier A', late: `${Math.min(96, disruption)}%`, driver: 'Lead time', action: disruption > 65 ? 'Escalate' : 'Monitor' },
    { id: 's2', supplier: 'Supplier B', late: `${Math.max(18, disruption - 19)}%`, driver: 'Variance', action: disruption > 55 ? 'Dual source' : 'Normal' },
    { id: 's3', supplier: 'Supplier C', late: `${Math.max(12, disruption - 31)}%`, driver: 'Geo risk', action: 'Watchlist' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Supplier Disruption Cockpit</h3>
        <p>Risk scoring UI built for procurement: supplier priority, likely driver, and the next operational move.</p>
      </div>
      <div className="control-grid">
        <label>Lead time days {leadTime}<input type="range" min="3" max="30" value={leadTime} onChange={(event) => setLeadTime(Number(event.target.value))} /></label>
        <label>Order variance {variance}%<input type="range" min="0" max="60" value={variance} onChange={(event) => setVariance(Number(event.target.value))} /></label>
        <label>Geo risk {risk}%<input type="range" min="0" max="80" value={risk} onChange={(event) => setRisk(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Disruption probability" value={`${disruption}%`} />
        <MetricTile label="Priority" value={disruption > 65 ? 'Escalate' : disruption > 40 ? 'Monitor' : 'Normal'} />
        <MetricTile label="SHAP driver" value={leadTime > variance ? 'Lead time' : 'Variance'} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'supplier', label: 'Supplier' },
            { key: 'late', label: 'Late risk' },
            { key: 'driver', label: 'Driver' },
            { key: 'action', label: 'Action' },
          ]}
          rows={suppliers}
        />
        <div className="driver-stack">
          <DriverBar label="Lead time contribution" value={leadTime / 8} />
          <DriverBar label="Order variance" value={variance / 18} />
          <DriverBar label="Geo risk exposure" value={risk / 24} tone="gold" />
        </div>
      </div>
    </div>
  );
}
