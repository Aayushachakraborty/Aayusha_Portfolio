import { useMemo } from 'react';
import RevealOnScroll from '../shared/RevealOnScroll';
import Decoration from '../shared/Decoration';
import { useReveal } from '../../hooks/useReveal';

function renderStaggered(lines, visible, offset = 0) {
  return lines.map((line, lineIndex) => (
    <span key={lineIndex}>
      {line.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className={`stagger-word ${visible ? 'on' : ''}`}
          style={{ transitionDelay: `${(offset + lineIndex * 3 + wordIndex) * 80}ms` }}
        >
          {word}&nbsp;
        </span>
      ))}
      {lineIndex < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export default function Skills({ skills, reducedMotion, decorations = [] }) {
  const flattened = useMemo(() => skills.groups?.flatMap((group) => group.items) || [], [skills.groups]);
  const { ref, visible } = useReveal({ disabled: reducedMotion });

  return (
    <section id="skills">
      {decorations.map((decoration) => <Decoration key={decoration.id} {...decoration} />)}
      <div className="sec-label">Skills</div>
      <h2 ref={ref} className={`skills-title rv ${visible ? 'on' : ''}`} data-stagger="true">
        {renderStaggered([["I", "don't", "just", "know"]], visible, 0)}
        <br />
        <em>
          <span className={`stagger-word ${visible ? 'on' : ''}`} style={{ transitionDelay: '320ms' }}>the</span>{' '}
          <span className={`stagger-word ${visible ? 'on' : ''}`} style={{ transitionDelay: '400ms' }}>tools.</span>
        </em>
        <br />
        {renderStaggered([["I", "know", "when", "to"]], visible, 6)}
        <br />
        <span className={`stagger-word ${visible ? 'on' : ''}`} style={{ transitionDelay: '720ms' }}>use</span>{' '}
        <span className={`stagger-word ${visible ? 'on' : ''}`} style={{ transitionDelay: '800ms' }}>them.</span>
      </h2>
      <RevealOnScroll as="div" className="skill-cloud" disabled={reducedMotion}>
        {flattened.map((skill) => (
          <span className={`sk ${skill.scale}`} key={skill.name}>{skill.name}</span>
        ))}
      </RevealOnScroll>
    </section>
  );
}
