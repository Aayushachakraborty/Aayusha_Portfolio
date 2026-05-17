export default function Character({ mode = 'ride' }) {
  return (
    <div className={`rider rider-${mode}`} aria-label="Aayusha driving through the portfolio world">
      <svg className="vehicle-car" viewBox="0 0 260 150" role="img">
        <defs>
          <linearGradient id="carBodyGradient" x1="0" x2="1">
            <stop offset="0" stopColor="#00d4ff" />
            <stop offset="1" stopColor="#7c5cff" />
          </linearGradient>
        </defs>
        <path className="car-shadow" d="M32 130c30 12 166 12 196 0" />
        <path className="car-body" d="M28 96c12-28 34-41 66-41h50c25 0 49 14 67 41l22 6c9 3 14 10 14 20v8H14v-11c0-12 5-19 14-23Z" />
        <path className="car-cabin" d="M82 55c10-20 25-30 44-30h18c18 0 33 10 45 30l-19 29H63l19-29Z" />
        <path className="car-window" d="M99 55c7-10 16-15 28-15h13c11 0 20 5 28 15l-12 18h-69l12-18Z" />
        <circle className="wheel wheel-back" cx="73" cy="120" r="24" />
        <circle className="wheel wheel-front" cx="190" cy="120" r="24" />
        <circle className="wheel-hub" cx="73" cy="120" r="8" />
        <circle className="wheel-hub" cx="190" cy="120" r="8" />
        <path className="car-light" d="M218 96h18c5 2 8 6 9 12h-28Z" />
        <path className="car-tail" d="M25 101h19v13H18c1-6 3-10 7-13Z" />
        <circle className="driver-head" cx="140" cy="54" r="10" />
        <path className="driver-body" d="M131 73c7-8 18-8 27 0" />
      </svg>
    </div>
  );
}
