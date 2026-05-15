export default function Sticker({ emoji, top, bottom, left, right, size, anim, delay, opacity }) {
  const style = {
    top,
    bottom,
    left,
    right,
    fontSize: size,
    opacity,
    animationDelay: delay,
  };

  return (
    <span className="sticker" style={style} data-anim={anim} aria-hidden="true">
      {emoji}
    </span>
  );
}
