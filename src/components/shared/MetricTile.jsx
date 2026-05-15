export default function MetricTile({ label, value }) {
  return (
    <div className="demo-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
