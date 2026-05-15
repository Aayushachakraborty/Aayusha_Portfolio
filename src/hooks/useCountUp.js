import { useEffect, useMemo, useState } from 'react';

function parseTarget(target) {
  const source = String(target ?? '').trim();
  const plus = source.endsWith('+');
  const numericPart = source.replace('+', '');
  const decimals = numericPart.includes('.') ? numericPart.split('.')[1].length : 0;
  const value = Number.parseFloat(numericPart);

  return {
    source,
    plus,
    decimals,
    value: Number.isNaN(value) ? 0 : value,
  };
}

function formatValue(current, config) {
  const rounded = config.decimals > 0 ? current.toFixed(config.decimals) : Math.round(current).toString();
  return `${rounded}${config.plus ? '+' : ''}`;
}

export function useCountUp(target, duration = 1200, start = false, delay = 0) {
  const config = useMemo(() => parseTarget(target), [target]);
  const [display, setDisplay] = useState(start ? formatValue(config.value, config) : formatValue(0, config));

  useEffect(() => {
    if (!start) {
      setDisplay(formatValue(0, config));
      return undefined;
    }

    let frameId = 0;
    let timeoutId = 0;
    let startTime = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = config.value * progress;
      setDisplay(formatValue(current, config));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [config, delay, duration, start]);

  return display;
}
