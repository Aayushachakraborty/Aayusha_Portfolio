import { cn } from '../../lib/utils.js';

const VARIANTS = {
  default: 'bg-ink-800 text-ink-100',
  citation: 'bg-sky-400/10 text-sky-400 ring-1 ring-sky-400/30 font-mono cursor-pointer hover:bg-sky-400/20',
  approve: 'bg-approve/15 text-approve ring-1 ring-approve/30',
  reject: 'bg-reject/15 text-reject ring-1 ring-reject/30',
  review: 'bg-review/15 text-review ring-1 ring-review/30',
  gold: 'bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30',
  muted: 'bg-ink-800 text-ink-200 ring-1 ring-ink-700',
};

export default function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded text-2xs px-1.5 py-0.5 align-middle',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
