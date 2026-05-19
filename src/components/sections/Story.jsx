import RevealOnScroll from '../shared/RevealOnScroll';
import Decoration from '../shared/Decoration';
import { useReveal } from '../../hooks/useReveal';
import { formatJobPeriodWithDuration } from '../../utils/format';

function StaggerLine({ words, startIndex, visible }) {
  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className={`stagger-word ${visible ? 'on' : ''}`}
      style={{ transitionDelay: `${(startIndex + index) * 80}ms` }}
    >
      {word}&nbsp;
    </span>
  ));
}

export default function Story({ experience, reducedMotion, decorations = [] }) {
  const { ref, visible } = useReveal({ disabled: reducedMotion });

  return (
    <section id="story" className="section">
      {decorations.map((decoration) => <Decoration key={decoration.id} {...decoration} />)}
      <div className="sec-label">Story</div>
      <p ref={ref} className={`story-intro rv ${visible ? 'on' : ''}`} data-stagger="true">
        <StaggerLine words={['I', 'like', 'roles', 'where', 'the', 'model', 'has', 'to', 'survive', 'contact', 'with', 'the', 'business.']} startIndex={0} visible={visible} />
        <strong>
          <StaggerLine words={['That', 'is', 'where', 'the', 'useful', 'work', 'starts.']} startIndex={13} visible={visible} />
        </strong>
      </p>
      <div className="jobs">
        {experience.items?.map((job) => (
          <RevealOnScroll as="article" className="job" key={`${job.company}-${job.role}`} disabled={reducedMotion}>
            <div className="job-year">{formatJobPeriodWithDuration(job)}</div>
            <div className="job-line"><div className="job-dot" /><div className="job-connector" /></div>
            <div className="job-content">
              <div className="job-company">{job.company}</div>
              <h3 className="job-title">{job.role}</h3>
              <div className="job-impact">{job.impact}</div>
              {job.bullets?.map((bullet) => <p className="job-desc" key={bullet}>{bullet}</p>)}
              <div className="job-tags">
                {(job.tags || []).map((tag) => <span className="jtag" key={tag}>{tag}</span>)}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
