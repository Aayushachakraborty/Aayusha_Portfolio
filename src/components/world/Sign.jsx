import CloudCard from './CloudCard';

export default function Sign({ title, children, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <CloudCard as={Tag} className="world-sign" type={onClick ? 'button' : undefined} onClick={onClick}>
      <strong>{title}</strong>
      {children ? <span>{children}</span> : null}
    </CloudCard>
  );
}
