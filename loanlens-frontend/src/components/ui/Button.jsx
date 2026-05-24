import { cn } from '../../lib/utils.js';

const VARIANTS = {
  primary:
    'bg-gold-500 text-ink-900 hover:bg-gold-400 font-medium',
  secondary:
    'bg-ink-700 text-ink-50 hover:bg-ink-600 border border-ink-600',
  ghost:
    'bg-transparent text-ink-100 hover:bg-ink-800 border border-ink-800',
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  md: 'text-sm px-4 py-2 rounded-md gap-2',
  lg: 'text-sm px-5 py-2.5 rounded-md gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
