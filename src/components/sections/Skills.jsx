import { useMemo } from 'react';
import RevealOnScroll from '../shared/RevealOnScroll';

export default function Skills({ skills, reducedMotion }) {
  const flattened = useMemo(() => skills.groups?.flatMap((group) => group.items) || [], [skills.groups]);

  return (
    <section id="skills">
      <div className="sec-label">Skills</div>
      <RevealOnScroll as="h2" className="skills-title" disabled={reducedMotion}>
        I don&apos;t just know<br /><em>the tools.</em><br />I know when to<br /><span>use them.</span>
      </RevealOnScroll>
      <RevealOnScroll as="div" className="skill-cloud" disabled={reducedMotion}>
        {flattened.map((skill) => (
          <span className={`sk ${skill.scale}`} key={skill.name}>{skill.name}</span>
        ))}
      </RevealOnScroll>
    </section>
  );
}
