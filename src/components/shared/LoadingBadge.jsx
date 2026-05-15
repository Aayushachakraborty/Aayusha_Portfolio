export default function LoadingBadge({ loading, source, error }) {
  if (!loading && !error) return null;
  return (
    <div className="loading" role="status">
      {loading ? 'Loading portfolio…' : error ? `Using ${source} data` : `Loaded from ${source}`}
    </div>
  );
}
