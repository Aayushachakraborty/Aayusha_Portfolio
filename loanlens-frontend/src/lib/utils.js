// Light utilities — keep them tiny so files read fast.

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function pct(x, digits = 1) {
  return `${(x * 100).toFixed(digits)}%`;
}

export function inr(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function relTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Parse an answer string with inline <cite>chunk_id</cite> markers into segments.
 * Returns: [{type: 'text', value}, {type: 'cite', id}, ...]
 * The Ask UI maps over this and renders text vs citation pills accordingly.
 */
export function parseCitations(text) {
  const segments = [];
  const regex = /<cite>([a-f0-9]+)<\/cite>/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, m.index) });
    }
    segments.push({ type: 'cite', id: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments;
}

export function confidenceLabel(c) {
  if (c >= 0.8) return { label: 'high', color: 'text-approve' };
  if (c >= 0.6) return { label: 'medium', color: 'text-review' };
  return { label: 'low', color: 'text-reject' };
}
