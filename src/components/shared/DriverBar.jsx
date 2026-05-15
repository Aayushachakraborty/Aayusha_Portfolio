export default function DriverBar({ label, value, tone = 'rust' }) {
  return (
    <div className="driver-bar">
      <div>
        <span>{label}</span>
        <strong>{value > 0 ? '+' : ''}{value.toFixed(2)}</strong>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${tone}`} style={{ width: `${Math.min(Math.abs(value) * 16, 100)}%` }} />
      </div>
    </div>
  );
}
