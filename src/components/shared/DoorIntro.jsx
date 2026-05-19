import { useEffect, useState } from 'react';

export default function DoorIntro({ reducedMotion }) {
  const [dismissed, setDismissed] = useState(false);
  const [opening, setOpening] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      const doneId = window.setTimeout(() => setDismissed(true), 850);
      return () => window.clearTimeout(doneId);
    }

    const openId = window.setTimeout(() => setOpening(true), 450);
    const doneId = window.setTimeout(() => setDismissed(true), 3200);

    return () => {
      window.clearTimeout(openId);
      window.clearTimeout(doneId);
    };
  }, [reducedMotion]);

  if (dismissed) return null;

  return (
    <div className={`door-intro ${opening ? 'is-opening' : ''}`} aria-label="Welcome to the world of data miracles">
      <div className="door-intro-glow" aria-hidden="true" />
      <div className="door-intro-message">
        <span>Welcome to</span>
        <strong>the world of data miracles</strong>
      </div>
      <div className="door-intro-stage" aria-hidden="true">
        <div className="door-panel door-left">
          <span className="door-grid" />
          <span className="door-handle" />
        </div>
        <div className="door-panel door-right">
          <span className="door-grid" />
          <span className="door-handle" />
        </div>
      </div>
    </div>
  );
}
