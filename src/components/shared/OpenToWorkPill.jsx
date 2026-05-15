export default function OpenToWorkPill({ label, onClick }) {
  return (
    <button type="button" className="open-pill" onClick={onClick}>
      <span className="open-pill-dot" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
