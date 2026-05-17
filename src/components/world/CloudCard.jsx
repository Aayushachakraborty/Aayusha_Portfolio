import { useId } from 'react';

export default function CloudCard({ as: Tag = 'div', className = '', children, ...props }) {
  const id = useId().replace(/:/g, '');
  const gradientId = `cloudCardFill-${id}`;
  const filterId = `cloudCardSoftEdge-${id}`;

  return (
    <Tag className={`cloud-card ${className}`} {...props}>
      <svg className="cloud-card-shape" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0.18)" />
            <stop offset="55%" stopColor="rgba(15, 15, 23, 0.58)" />
            <stop offset="100%" stopColor="rgba(15, 15, 23, 0.48)" />
          </linearGradient>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
          stroke="rgba(0, 212, 255, 0.4)"
          strokeWidth="1.5"
          d="M 60 180 C 20 180, 10 140, 40 120 C 25 90, 55 60, 90 70 C 100 40, 150 30, 180 55 C 200 25, 260 25, 280 60 C 320 50, 360 80, 350 120 C 385 130, 385 175, 350 180 Z"
        />
      </svg>
      <div className="cloud-card-content">
        {children}
      </div>
    </Tag>
  );
}
