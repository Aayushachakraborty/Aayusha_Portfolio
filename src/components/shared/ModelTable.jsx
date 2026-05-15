export default function ModelTable({ rows, columns }) {
  return (
    <div className="model-table">
      <div className="model-table-head" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {columns.map((column) => <span key={column.key}>{column.label}</span>)}
      </div>
      {rows.map((row) => (
        <div className="model-table-row" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} key={row.id || JSON.stringify(row)}>
          {columns.map((column) => <span key={column.key}>{row[column.key]}</span>)}
        </div>
      ))}
    </div>
  );
}
