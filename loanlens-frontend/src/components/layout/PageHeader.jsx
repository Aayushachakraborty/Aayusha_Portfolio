export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="border-b border-ink-800 bg-ink-900/40">
      <div className="px-8 py-7">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            {eyebrow && (
              <div className="text-2xs font-mono text-ink-300 uppercase tracking-widest mb-2">
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-[26px] leading-tight font-medium tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-ink-200 mt-2 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
