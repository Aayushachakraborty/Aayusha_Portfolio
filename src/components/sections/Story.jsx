import RevealOnScroll from '../shared/RevealOnScroll';

export default function Story({ experience, reducedMotion }) {
  return (
    <section id="story" className="section">
      <div className="sec-label">Story</div>
      <RevealOnScroll as="p" className="story-intro" disabled={reducedMotion}>
        I like roles where the model has to survive contact with the business. <strong>That is where the useful work starts.</strong>
      </RevealOnScroll>
      <div className="jobs">
        {experience.items?.map((job) => (
          <RevealOnScroll as="article" className="job" key={`${job.company}-${job.role}`} disabled={reducedMotion}>
            <div className="job-year">{job.period}</div>
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
