import { useEffect } from 'react';

export function useCursor(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const cursor = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!cursor || !ring || window.matchMedia('(pointer: coarse)').matches) return undefined;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frameId = 0;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      frameId = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', move);
    loop();

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(frameId);
    };
  }, [enabled]);
}
