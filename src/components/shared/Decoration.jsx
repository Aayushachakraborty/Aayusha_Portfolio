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
  animate,
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

    /* ── ANIMATED STICKERS ─────────────────────────────────── */

    'bar-chart': (
      <svg style={svgStyle} viewBox="0 0 128 106" aria-hidden="true">
        <line x1="8" y1="94" x2="120" y2="94" stroke={stroke} strokeWidth="1.5" opacity="0.35" />
        <rect className="sk-bar sk-bar-1" x="10" y="64" width="16" height="30" rx="2" fill={stroke} opacity="0.55" />
        <rect className="sk-bar sk-bar-2" x="32" y="44" width="16" height="50" rx="2" fill={stroke} opacity="0.72" />
        <rect className="sk-bar sk-bar-3" x="54" y="28" width="16" height="66" rx="2" fill="var(--rust)" opacity="0.82" />
        <rect className="sk-bar sk-bar-4" x="76" y="50" width="16" height="44" rx="2" fill={stroke} opacity="0.65" />
        <rect className="sk-bar sk-bar-5" x="98" y="14" width="16" height="80" rx="2" fill="var(--gold)" opacity="0.72" />
        <path d="M18,64 L40,44 L62,28 L84,50 L106,14" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />
      </svg>
    ),

    'neural-pulse': (
      <svg style={svgStyle} viewBox="0 0 200 160" aria-hidden="true">
        <line className="sk-edge sk-edge-1" x1="25" y1="80" x2="90" y2="40" stroke={stroke} strokeWidth="1.2" opacity="0.65" />
        <line className="sk-edge sk-edge-2" x1="25" y1="80" x2="90" y2="120" stroke={stroke} strokeWidth="1.2" opacity="0.65" />
        <line className="sk-edge sk-edge-3" x1="90" y1="40" x2="155" y2="20" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-4" x1="90" y1="40" x2="155" y2="80" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-5" x1="90" y1="120" x2="155" y2="80" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-6" x1="90" y1="120" x2="155" y2="140" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <circle className="sk-node sk-node-1" cx="25" cy="80" r="6" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle className="sk-node sk-node-2" cx="90" cy="40" r="5.5" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle className="sk-node sk-node-3" cx="90" cy="120" r="5.5" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle className="sk-node sk-node-4" cx="155" cy="20" r="5" fill={stroke} opacity="0.7" />
        <circle className="sk-node sk-node-5" cx="155" cy="80" r="5" fill={stroke} opacity="0.88" />
        <circle cx="155" cy="140" r="5" fill={stroke} opacity="0.6" />
      </svg>
    ),

    'forecast-cone': (
      <svg style={svgStyle} viewBox="0 0 240 120" aria-hidden="true">
        <path d="M10,95 C30,82 50,70 70,60 C90,48 110,55 125,50" fill="none" stroke={stroke} strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
        <path d="M125,50 C150,32 178,18 220,12 L220,46 C178,48 150,58 125,50 Z" fill={stroke} opacity="0.13" />
        <path d="M125,50 C150,64 178,82 220,90 L220,46 C178,48 150,58 125,50 Z" fill={stroke} opacity="0.09" />
        <path className="sk-forecast" d="M125,50 C150,44 178,28 220,26" fill="none" stroke={stroke} strokeWidth="2.2" strokeDasharray="7 4" opacity="0.9" strokeLinecap="round" />
        <line x1="125" y1="16" x2="125" y2="108" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.32" />
        <circle cx="125" cy="50" r="4.5" fill={stroke} opacity="0.9" />
        <circle cx="220" cy="26" r="3" fill={stroke} opacity="0.55" />
      </svg>
    ),

    'supply-flow': (
      <svg style={svgStyle} viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="26" cy="90" r="14" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.8" />
        <text x="19" y="95" fontSize="11" fill={stroke} opacity="0.8" fontWeight="700" fontFamily="monospace">S</text>
        <circle cx="82" cy="42" r="11" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.75" />
        <text x="77" y="47" fontSize="9" fill={stroke} opacity="0.75" fontWeight="700" fontFamily="monospace">F</text>
        <circle cx="82" cy="138" r="11" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.75" />
        <text x="77" y="143" fontSize="9" fill={stroke} opacity="0.75" fontWeight="700" fontFamily="monospace">W</text>
        <circle cx="154" cy="90" r="13" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.8" />
        <text x="148" y="95" fontSize="9" fill={stroke} opacity="0.8" fontWeight="700" fontFamily="monospace">D</text>
        <line className="sk-edge sk-edge-1" x1="40" y1="84" x2="71" y2="52" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-3" x1="40" y1="96" x2="71" y2="128" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-5" x1="93" y1="48" x2="141" y2="80" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <line className="sk-edge sk-edge-2" x1="93" y1="132" x2="141" y2="100" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
      </svg>
    ),
  };

  return (
    <div
      style={style}
      data-decoration="true"
      aria-hidden="true"
      {...(animate ? { 'data-sticker': animate } : {})}
    >
      {shapes[type] || null}
    </div>
  );
}
