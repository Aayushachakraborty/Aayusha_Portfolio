import { useReveal } from '../../hooks/useReveal';

export default function RevealOnScroll({ as: Tag = 'div', className = '', disabled = false, children, ...props }) {
  const { ref, visible } = useReveal({ disabled });
  const classes = ['rv', visible ? 'on' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...props}>
      {children}
    </Tag>
  );
}
