export default function Decoration({
  type,
  top,
  bottom,
  left,
  right,
  width,
  height,
  color,
  opacity,
}) {
  const style = {
    position: 'absolute',
    top,
    bottom,
    left,
    right,
    width,
    height,
    pointerEvents: 'none',
    zIndex: 1,
    opacity,
    overflow: 'visible',
  };

  const svgStyle = { width: '100%', height: '100%', overflow: 'visible' };
  const stroke = color;

  const shapes = {
    'dot-grid': (
      <svg style={svgStyle} aria-hidden="true">
        <defs>
          <pattern id="dot-p" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill={stroke} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-p)" />
      </svg>
    ),
    'sine-wave': (
      <svg style={svgStyle} viewBox="0 0 480 120" aria-hidden="true" preserveAspectRatio="none">
        <path
          d="M0,60 C40,10 80,110 120,60 C160,10 200,110 240,60 C280,10 320,110 360,60 C400,10 440,110 480,60"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M0,80 C40,30 80,130 120,80 C160,30 200,130 240,80 C280,30 320,130 360,80 C400,30 440,130 480,80"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    ),
    'node-graph': (
      <svg style={svgStyle} viewBox="0 0 220 220" aria-hidden="true">
        <line x1="110" y1="110" x2="40" y2="40" stroke={stroke} strokeWidth="1" />
        <line x1="110" y1="110" x2="180" y2="40" stroke={stroke} strokeWidth="1" />
        <line x1="110" y1="110" x2="40" y2="180" stroke={stroke} strokeWidth="1" />
        <line x1="110" y1="110" x2="180" y2="180" stroke={stroke} strokeWidth="1" />
        <line x1="110" y1="110" x2="110" y2="20" stroke={stroke} strokeWidth="1" />
        <line x1="40" y1="40" x2="110" y2="20" stroke={stroke} strokeWidth="0.8" />
        <line x1="180" y1="40" x2="110" y2="20" stroke={stroke} strokeWidth="0.8" />
        {[
          [110, 110, 5],
          [40, 40, 3.5],
          [180, 40, 3.5],
          [40, 180, 3.5],
          [180, 180, 3.5],
          [110, 20, 3],
        ].map(([cx, cy, r], index) => (
          <circle key={index} cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="1.2" />
        ))}
      </svg>
    ),
    'radar-rings': (
      <svg style={svgStyle} viewBox="0 0 340 340" aria-hidden="true">
        {[140, 105, 70, 35].map((r, index) => (
          <polygon
            key={index}
            points={[0, 1, 2, 3, 4, 5].map((n) => {
              const a = (Math.PI / 3) * n - Math.PI / 2;
              return `${170 + r * Math.cos(a)},${170 + r * Math.sin(a)}`;
            }).join(' ')}
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((n) => {
          const a = (Math.PI / 3) * n - Math.PI / 2;
          return (
            <line
              key={n}
              x1="170"
              y1="170"
              x2={170 + 140 * Math.cos(a)}
              y2={170 + 140 * Math.sin(a)}
              stroke={stroke}
              strokeWidth="0.8"
            />
          );
        })}
      </svg>
    ),
    'hex-grid': (
      <svg style={svgStyle} aria-hidden="true">
        <defs>
          <pattern id="hex-p" x="0" y="0" width="52" height="60" patternUnits="userSpaceOnUse">
            <polygon
              points="26,2 50,15 50,45 26,58 2,45 2,15"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-p)" />
      </svg>
    ),
    'flow-tree': (
      <svg style={svgStyle} viewBox="0 0 260 260" aria-hidden="true">
        <circle cx="130" cy="30" r="6" fill="none" stroke={stroke} strokeWidth="1.2" />
        <line x1="130" y1="36" x2="70" y2="100" stroke={stroke} strokeWidth="1" />
        <line x1="130" y1="36" x2="190" y2="100" stroke={stroke} strokeWidth="1" />
        <circle cx="70" cy="106" r="5" fill="none" stroke={stroke} strokeWidth="1.2" />
        <circle cx="190" cy="106" r="5" fill="none" stroke={stroke} strokeWidth="1.2" />
        <line x1="70" y1="111" x2="40" y2="175" stroke={stroke} strokeWidth="0.9" />
        <line x1="70" y1="111" x2="100" y2="175" stroke={stroke} strokeWidth="0.9" />
        <line x1="190" y1="111" x2="160" y2="175" stroke={stroke} strokeWidth="0.9" />
        <line x1="190" y1="111" x2="220" y2="175" stroke={stroke} strokeWidth="0.9" />
        {[
          [40, 180],
          [100, 180],
          [160, 180],
          [220, 180],
        ].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r="4" fill={stroke} />
        ))}
      </svg>
    ),
  };

  return (
    <div style={style} data-decoration="true" aria-hidden="true">
      {shapes[type] || null}
    </div>
  );
}
