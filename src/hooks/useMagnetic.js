import { useState } from 'react';

export function useMagnetic(enabled = true, maxShift = 8) {
  const [style, setStyle] = useState({ transform: 'translate3d(0, 0, 0)' });

  function onMouseMove(event) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = ((x / rect.width) - 0.5) * 2 * maxShift;
    const dy = ((y / rect.height) - 0.5) * 2 * maxShift;
    setStyle({ transform: `translate3d(${dx}px, ${dy}px, 0)` });
  }

  function onMouseLeave() {
    setStyle({ transform: 'translate3d(0, 0, 0)' });
  }

  return {
    style,
    onMouseMove,
    onMouseLeave,
  };
}
