import { useCursor } from '../../hooks/useCursor';

export default function Cursor({ enabled }) {
  useCursor(enabled);

  if (!enabled) return null;

  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  );
}
