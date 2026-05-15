import { useState } from 'react';
import DriverBar from '../shared/DriverBar';
import MetricTile from '../shared/MetricTile';
import ModelTable from '../shared/ModelTable';

export default function PricingDemo() {
  const [price, setPrice] = useState(999);
  const [demand, setDemand] = useState(1200);
  const [elasticity, setElasticity] = useState(1.4);
  const basePrice = 999;
  const demandShift = Math.max(120, Math.round(demand * (1 - ((price - basePrice) / basePrice) * elasticity)));
  const revenue = demandShift * price;
  const margin = Math.round(revenue * 0.31);
  const lift = Math.round(((revenue - demand * basePrice) / (demand * basePrice)) * 100);
  const recommendation = revenue > demand * basePrice ? 'Accept price' : 'Test smaller lift';
  const curve = [-15, -8, 0, 7, 14].map((change) => {
    const candidate = Math.round(basePrice * (1 + change / 100));
    const units = Math.max(100, Math.round(demand * (1 - (change / 100) * elasticity)));
    return {
      id: change,
      price: `Rs ${candidate}`,
      units: units.toLocaleString(),
      revenue: `Rs ${Math.round((candidate * units) / 100000)}L`,
    };
  });

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Dynamic Pricing Model Lab</h3>
        <p>Designed like a pricing analyst&apos;s cockpit: elasticity, expected units, revenue lift, margin, and explainability in one view.</p>
      </div>
      <div className="control-grid">
        <label>Candidate price Rs {price}<input type="range" min="699" max="1499" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label>
        <label>Base demand {demand}<input type="range" min="400" max="2200" value={demand} onChange={(event) => setDemand(Number(event.target.value))} /></label>
        <label>Elasticity {elasticity.toFixed(1)}<input type="range" min="0.5" max="2.5" step="0.1" value={elasticity} onChange={(event) => setElasticity(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Predicted units" value={demandShift.toLocaleString()} />
        <MetricTile label="Revenue lift" value={`${lift > 0 ? '+' : ''}${lift}%`} />
        <MetricTile label="Gross margin" value={`Rs ${Math.round(margin / 100000)}L`} />
        <MetricTile label="Action" value={recommendation} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'price', label: 'Price' },
            { key: 'units', label: 'Units' },
            { key: 'revenue', label: 'Revenue' },
          ]}
          rows={curve}
        />
        <div className="driver-stack">
          <DriverBar label="Competitor gap" value={price > 1100 ? -1.7 : 0.8} />
          <DriverBar label="Demand elasticity" value={2.6 - elasticity} />
          <DriverBar label="Retargeting intent" value={1.9} tone="gold" />
        </div>
      </div>
    </div>
  );
}
