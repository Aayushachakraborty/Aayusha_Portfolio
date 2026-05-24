import { cn } from '../../lib/utils.js';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-ink-900 border border-ink-800 rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('px-5 py-4 border-b border-ink-800', className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function Label({ children, className }) {
  return (
    <div
      className={cn(
        'text-2xs font-mono text-ink-300 uppercase tracking-widest',
        className
      )}
    >
      {children}
    </div>
  );
}
