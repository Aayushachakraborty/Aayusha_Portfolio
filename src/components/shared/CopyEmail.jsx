import { useEffect, useState } from 'react';

export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch (error) {
      setCopied(false);
    }
  }

  return (
    <span className="copy-wrap">
      <button type="button" className="copy-btn" onClick={handleCopy}>
        Copy email
      </button>
      <span className="copy-state" aria-live="polite">{copied ? 'Copied' : ''}</span>
    </span>
  );
}
