const heights = {
  short: 150,
  medium: 220,
  skyscraper: 300,
};

export default function Building({ variant = 'medium', hue = 'cyan' }) {
  const height = heights[variant] || heights.medium;
  const floors = Math.floor(height / 34);

  return (
    <svg className={`world-building building-${variant} building-${hue}`} viewBox={`0 0 130 ${height}`} aria-hidden="true">
      <rect x="8" y="10" width="114" height={height - 10} rx="6" />
      {Array.from({ length: floors }).map((_, row) => (
        Array.from({ length: 3 }).map((__, col) => (
          <rect
            key={`${row}-${col}`}
            className={(row + col) % 3 === 0 ? 'lit' : ''}
            x={24 + col * 30}
            y={28 + row * 30}
            width="14"
            height="16"
            rx="2"
          />
        ))
      ))}
    </svg>
  );
}
